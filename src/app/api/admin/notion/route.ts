import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';
import { downloadAndSaveRemoteImage } from '@/lib/storage';

// POST Trigger Notion Sync or CSV Sync
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canSyncNotion');
  if (auth instanceof NextResponse) return auth;

  try {
    const { apiKey, databaseId, fieldMappings, action } = await req.json();

    const notionKey = apiKey || process.env.NOTION_API_KEY;
    const notionDb = databaseId || process.env.NOTION_DATABASE_ID;

    if (!notionKey || !notionDb) {
      return NextResponse.json({
        success: false,
        error: 'Notion API Key or Database ID not configured.',
      }, { status: 400 });
    }

    // Clean database ID (strip dashes and URLs if user pasted full URL)
    let cleanDbId = notionDb.trim();
    if (cleanDbId.includes('notion.so/')) {
      const match = cleanDbId.match(/([a-f0-9]{32})/i) || cleanDbId.split('/').pop()?.split('?')[0]?.match(/[a-f0-9]{32}/i);
      if (match) cleanDbId = match[1];
    }
    cleanDbId = cleanDbId.replace(/-/g, '');

    // Action 1: Test Connection Only
    if (action === 'test_connection') {
      const dbMetaRes = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notionKey.trim()}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (!dbMetaRes.ok) {
        const errText = await dbMetaRes.text();
        return NextResponse.json({
          success: false,
          error: `Could not connect to Notion Database: HTTP ${dbMetaRes.status}. Ensure your integration has been shared with this database in Notion.`,
          details: errText
        }, { status: 400 });
      }

      const dbMeta = await dbMetaRes.json();
      const title = dbMeta.title?.[0]?.plain_text || 'Members Database';

      // Persist verified connection credentials so user only needs to connect once
      await prisma.siteContent.upsert({
        where: { key: 'notion.connection_config' },
        update: {
          value: JSON.stringify({
            apiKey: notionKey.trim(),
            databaseId: cleanDbId,
            databaseTitle: title,
            connectedAt: new Date().toISOString(),
          }),
        },
        create: {
          key: 'notion.connection_config',
          value: JSON.stringify({
            apiKey: notionKey.trim(),
            databaseId: cleanDbId,
            databaseTitle: title,
            connectedAt: new Date().toISOString(),
          }),
          section: 'admin',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully connected to Notion database "${title}". Connection credentials saved!`,
        databaseTitle: title,
      });
    }

    // Persist verified connection credentials on sync as well
    await prisma.siteContent.upsert({
      where: { key: 'notion.connection_config' },
      update: {
        value: JSON.stringify({
          apiKey: notionKey.trim(),
          databaseId: cleanDbId,
          connectedAt: new Date().toISOString(),
        }),
      },
      create: {
        key: 'notion.connection_config',
        value: JSON.stringify({
          apiKey: notionKey.trim(),
          databaseId: cleanDbId,
          connectedAt: new Date().toISOString(),
        }),
        section: 'admin',
      },
    });

    // Action 2: Perform Member Sync (support pagination)
    let allNotionPages: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const queryBody: any = { page_size: 100 };
      if (startCursor) queryBody.start_cursor = startCursor;

      const notionRes = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionKey.trim()}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryBody),
      });

      if (!notionRes.ok) {
        const errText = await notionRes.text();
        await prisma.notionSyncLog.create({
          data: {
            status: 'FAILED',
            recordsSynced: 0,
            errorDetails: `Notion Query HTTP ${notionRes.status}: ${errText}`,
            triggeredBy: auth.user.email,
          },
        });
        return NextResponse.json({ error: `Notion API Error (${notionRes.status}): ${errText}` }, { status: 400 });
      }

      const notionData = await notionRes.json();
      const batch = notionData.results || [];
      allNotionPages = allNotionPages.concat(batch);

      hasMore = Boolean(notionData.has_more);
      startCursor = notionData.next_cursor || undefined;
    }

    const results = allNotionPages;

    // Fetch default tiers so we can map Notion records by Tier name
    const allTiers = await prisma.tier.findMany();
    const defaultTier = allTiers.find((t) => t.name === 'Basic') || allTiers[0];

    // Upsert records into Member table in DB
    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;

    for (const page of results) {
      try {
        const props = page.properties || {};

        // Helper to extract plain text string from any Notion property type
        const getPropVal = (prop: any): string => {
          if (!prop) return '';
          if (prop.type === 'title' && prop.title?.length > 0) {
            return prop.title.map((t: any) => t.plain_text).join('').trim();
          }
          if (prop.type === 'rich_text' && prop.rich_text?.length > 0) {
            return prop.rich_text.map((t: any) => t.plain_text).join('').trim();
          }
          if (prop.type === 'phone_number') {
            return prop.phone_number?.trim() || '';
          }
          if (prop.type === 'email') {
            return prop.email?.trim() || '';
          }
          if (prop.type === 'select' && prop.select) {
            return prop.select.name?.trim() || '';
          }
          if (prop.type === 'status' && prop.status) {
            return prop.status.name?.trim() || '';
          }
          if (prop.type === 'formula') {
            return prop.formula?.string || prop.formula?.number?.toString() || '';
          }
          if (prop.type === 'number') {
            return prop.number?.toString() || '';
          }
          if (prop.type === 'url') {
            return prop.url?.trim() || '';
          }
          return '';
        };

        // Fuzzy search matching property by checking key names
        const findPropByNames = (names: string[]) => {
          const keys = Object.keys(props);
          for (const n of names) {
            const matchedKey = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === n.toLowerCase().replace(/[^a-z0-9]/g, ''));
            if (matchedKey && props[matchedKey]) return props[matchedKey];
          }
          return null;
        };

        // 1. Extract Name (Check title property first as that is Notion's primary key)
        let name = '';
        for (const k of Object.keys(props)) {
          if (props[k]?.type === 'title') {
            name = getPropVal(props[k]);
            if (name) break;
          }
        }
        if (!name) {
          const nameProp = findPropByNames(['name', 'fullname', 'membername', 'member', 'full_name', 'applicant', 'user']);
          name = getPropVal(nameProp);
        }
        // Fallback if still empty
        if (!name) {
          name = `Notion Member (${page.id.substring(0, 6)})`;
        }

        // 2. Extract Phone Number
        let phone = '';
        const phoneProp = findPropByNames(['phone', 'phonenumber', 'phone_number', 'mobile', 'cell', 'tel', 'telebirr', 'contact', 'telephone']);
        if (phoneProp) {
          phone = getPropVal(phoneProp);
        }

        // If phone wasn't found in dedicated property, check if any rich_text has digits
        if (!phone) {
          for (const k of Object.keys(props)) {
            const val = getPropVal(props[k]);
            if (/(\+?\d[\d\s-]{6,}\d)/.test(val)) {
              phone = val;
              break;
            }
          }
        }

        // If still no phone, generate placeholder so record is NEVER skipped
        if (!phone) {
          phone = `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;
        }

        // Clean & normalize phone
        const normalizedPhone = phone.trim().replace(/[^\d+]/g, '') || `+2519${Date.now().toString().slice(-8)}`;

        // 3. Extract Status
        const statusProp = findPropByNames(['status', 'approvalstatus', 'approval_status', 'state', 'membershipstatus']);
        const statusText = getPropVal(statusProp).toUpperCase();

        let memberStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' = 'APPROVED';
        if (statusText.includes('PENDING')) memberStatus = 'PENDING';
        else if (statusText.includes('REJECT')) memberStatus = 'REJECTED';
        else if (statusText.includes('SUSPEND')) memberStatus = 'SUSPENDED';

        // 4. Extract Tier
        const tierProp = findPropByNames(['tier', 'membershiptier', 'membership_tier', 'tiername', 'level', 'badge']);
        const tierText = getPropVal(tierProp).toLowerCase();

        const matchedTier =
          allTiers.find((t) => tierText.includes(t.name.toLowerCase())) ||
          defaultTier;

        // 5. Extract Email
        const emailProp = findPropByNames(['email', 'mail', 'emailaddress', 'email_address']);
        const email = getPropVal(emailProp) || null;

        // Extract Avatar / Photo from Notion Properties (Files & Media, URL, Icon, or Cover)
        let photoUrl: string | null = null;

        // 1. Check any property that has type 'files' first
        for (const k of Object.keys(props)) {
          const p = props[k];
          if (p?.type === 'files' && Array.isArray(p.files) && p.files.length > 0) {
            const f = p.files[0];
            photoUrl = f.file?.url || f.external?.url || null;
            if (photoUrl) break;
          }
        }

        // 2. If not found in files, check properties named photo/avatar/picture/image/profile
        if (!photoUrl) {
          const photoProp = findPropByNames(['photo', 'avatar', 'picture', 'profile', 'image', 'memberphoto', 'member_photo', 'memberavatar', 'headshot']);
          if (photoProp) {
            if (photoProp.type === 'files' && photoProp.files?.length > 0) {
              const firstFile = photoProp.files[0];
              photoUrl = firstFile.file?.url || firstFile.external?.url || null;
            } else if (photoProp.type === 'url' && photoProp.url) {
              photoUrl = photoProp.url;
            } else if (photoProp.type === 'rich_text' && photoProp.rich_text?.length > 0) {
              const txt = photoProp.rich_text[0].plain_text?.trim() || '';
              if (txt.startsWith('http')) photoUrl = txt;
            }
          }
        }

        // 3. Check any URL property if it looks like an image or general URL
        if (!photoUrl) {
          for (const k of Object.keys(props)) {
            const p = props[k];
            if (p?.type === 'url' && p.url && /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(p.url)) {
              photoUrl = p.url;
              break;
            }
          }
        }

        // 4. Fallback to Notion Page Icon (external URL or file) if property not set
        if (!photoUrl && page.icon) {
          if (page.icon.type === 'external') {
            photoUrl = page.icon.external?.url || null;
          } else if (page.icon.type === 'file') {
            photoUrl = page.icon.file?.url || null;
          }
        }

        // 5. Fallback to Notion Page Cover
        if (!photoUrl && page.cover) {
          if (page.cover.type === 'external') {
            photoUrl = page.cover.external?.url || null;
          } else if (page.cover.type === 'file') {
            photoUrl = page.cover.file?.url || null;
          }
        }

        // 6. Notion file URLs expire within 1 hour (AWS S3 signed links).
        // Download and store the image permanently on our server so it never becomes blank or broken.
        if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
          try {
            photoUrl = await downloadAndSaveRemoteImage(photoUrl, 'avatars', `notion-member-${page.id.substring(0, 8)}`);
          } catch (imgErr) {
            console.warn(`[Notion Sync] Failed to download avatar for ${name}:`, imgErr);
            // Keep remote url as fallback if download fails
          }
        }

        const uniqueRandom = Math.random().toString(36).substring(2, 7).toUpperCase();
        const membershipCode =
          props['Membership Code']?.rich_text?.[0]?.plain_text ||
          props['Member ID']?.rich_text?.[0]?.plain_text ||
          `EM-${new Date().getFullYear()}-${uniqueRandom}`;

        // Check if member already exists by phone or Notion ID
        let existingMember = null;
        if (page.id) {
          existingMember = await prisma.member.findFirst({
            where: { notionPageId: page.id }
          });
        }
        if (!existingMember && normalizedPhone) {
          existingMember = await prisma.member.findFirst({
            where: { normalizedPhone }
          });
        }

        if (existingMember) {
          await prisma.member.update({
            where: { id: existingMember.id },
            data: {
              fullName: name,
              phoneNumber: phone,
              email: email || existingMember.email,
              photoUrl: photoUrl || existingMember.photoUrl,
              status: memberStatus,
              tierId: matchedTier?.id || existingMember.tierId,
              notionPageId: page.id,
              isDeleted: false,
              updatedAt: new Date(),
            }
          });
          updatedCount++;
        } else {
          // If normalizedPhone already exists, append unique suffix to avoid SQLite unique constraint rejection
          let safePhone = normalizedPhone;
          const phoneConflict = await prisma.member.findUnique({ where: { normalizedPhone: safePhone } });
          if (phoneConflict) {
            safePhone = `${normalizedPhone}-${uniqueRandom}`;
          }

          // If membershipCode already exists, make unique
          let safeCode = membershipCode;
          const codeConflict = await prisma.member.findUnique({ where: { membershipCode: safeCode } });
          if (codeConflict) {
            safeCode = `${membershipCode}-${uniqueRandom}`;
          }

          await prisma.member.create({
            data: {
              fullName: name,
              country: 'Ethiopia',
              countryCode: safePhone.startsWith('+') ? safePhone.slice(0, 4) : '+251',
              phoneNumber: phone,
              normalizedPhone: safePhone,
              email,
              photoUrl,
              tierId: matchedTier?.id || defaultTier.id,
              membershipCode: safeCode,
              paymentMethod: 'Notion Sync',
              paymentReference: `NOTION-${page.id.replace(/-/g, '').substring(0, 8)}`,
              status: memberStatus,
              notionPageId: page.id,
              isDeleted: false,
            }
          });
          createdCount++;
        }

        syncedCount++;
      } catch (err: any) {
        console.error('Record parse/upsert error:', err);
      }
    }

    await prisma.notionSyncLog.create({
      data: {
        status: 'SUCCESS',
        recordsSynced: syncedCount,
        triggeredBy: auth.user.email,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'NOTION_SYNC_EXECUTED',
      entityType: 'NotionSyncLog',
      newValue: { recordsSynced: syncedCount, createdCount, updatedCount },
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${syncedCount} members into database (${createdCount} created, ${updatedCount} updated).`,
      syncedCount,
      createdCount,
      updatedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Notion sync failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await enforceAuth(req, 'canSyncNotion');
  if (auth instanceof NextResponse) return auth;

  try {
    const [logs, savedConfigRecord] = await Promise.all([
      prisma.notionSyncLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.siteContent.findUnique({
        where: { key: 'notion.connection_config' },
      }),
    ]);

    let savedConfig: any = null;
    if (savedConfigRecord?.value) {
      try {
        savedConfig = JSON.parse(savedConfigRecord.value);
      } catch (e) {
        console.error('Failed to parse saved notion config', e);
      }
    }

    return NextResponse.json({
      success: true,
      logs,
      savedConfig,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get logs' }, { status: 500 });
  }
}
