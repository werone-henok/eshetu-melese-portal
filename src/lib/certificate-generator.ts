import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import { ensureFontsRegistered } from './card-generator';
import { CertificateTemplateConfig, DEFAULT_CERTIFICATE_TEMPLATE } from './certificate-types';

export interface CertificateMemberData {
  membershipCode: string;
  fullName: string;
  photoUrl?: string | null;
  tierName?: string;
  approvedAt?: Date | string | null;
  createdAt?: Date | string | null;
}

function roundRect(ctx: any, x: number, y: number, width: number, height: number, radius: number) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawDefaultCertificateAvatar(ctx: any, x: number, y: number, w: number, h: number, radius: number, name: string) {
  ctx.save();
  ctx.fillStyle = '#F3E8D2';
  ctx.beginPath();
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();

  const initial = name ? name.trim().charAt(0).toUpperCase() : 'E';
  ctx.font = `bold ${Math.floor(w * 0.42)}px Nyala, Arial, sans-serif`;
  ctx.fillStyle = '#8B5A2B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, x + w / 2, y + h / 2);
  ctx.restore();
}

export async function generateCertificateBuffer(params: {
  member: CertificateMemberData;
  template?: CertificateTemplateConfig;
  siteUrl?: string;
}): Promise<Buffer> {
  ensureFontsRegistered();

  const template = params.template || DEFAULT_CERTIFICATE_TEMPLATE;
  const width = template.width || 1024;
  const height = template.height || 712;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Draw Background Template Image
  const baseDesignUrl = template.baseDesignUrl || DEFAULT_CERTIFICATE_TEMPLATE.baseDesignUrl;
  let bgDrawn = false;

  if (baseDesignUrl) {
    try {
      let bgImg: any = null;
      if (baseDesignUrl.startsWith('data:')) {
        bgImg = await loadImage(baseDesignUrl);
      } else if (baseDesignUrl.startsWith('http')) {
        const resp = await fetch(baseDesignUrl);
        const buf = await resp.arrayBuffer();
        bgImg = await loadImage(Buffer.from(buf));
      } else {
        const fullPath = path.join(process.cwd(), 'public', baseDesignUrl.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          bgImg = await loadImage(fullPath);
        }
      }

      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, width, height);
        bgDrawn = true;
      }
    } catch (err) {
      console.warn('Failed to draw certificate background image:', err);
    }
  }

  if (!bgDrawn) {
    // Elegant parchment fallback
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = '#8B5A2B';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
  }

  // Pre-generate QR code if needed by any element
  const hasQr = template.elements.some((el) => el.type === 'qr' && el.visible !== false);
  let qrImage: any = null;
  if (hasQr) {
    try {
      const siteUrl = params.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const verifyUrl = `${siteUrl}/card/${params.member.membershipCode}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 320,
      });
      qrImage = await loadImage(qrDataUrl);
    } catch (qrErr) {
      console.warn('Failed to generate certificate QR:', qrErr);
    }
  }

  // Pre-load Member Photo
  let memberPhotoImg: any = null;
  const isExpiredNotionUrl =
    params.member.photoUrl &&
    (params.member.photoUrl.includes('prod-files-secure.s3') ||
      params.member.photoUrl.includes('secure.notion-static') ||
      params.member.photoUrl.includes('s3.us-west-2.amazonaws.com'));

  if (params.member.photoUrl && !isExpiredNotionUrl) {
    try {
      if (params.member.photoUrl.startsWith('data:')) {
        memberPhotoImg = await loadImage(params.member.photoUrl);
      } else if (params.member.photoUrl.startsWith('http')) {
        const pResp = await fetch(params.member.photoUrl);
        const pBuf = await pResp.arrayBuffer();
        memberPhotoImg = await loadImage(Buffer.from(pBuf));
      } else {
        const photoPath = path.join(process.cwd(), 'public', params.member.photoUrl.replace(/^\//, ''));
        if (fs.existsSync(photoPath)) {
          memberPhotoImg = await loadImage(photoPath);
        }
      }
    } catch (err) {
      console.warn('Failed to load member photo for certificate:', err);
    }
  }

  // 2. Render Each Element
  for (const el of template.elements) {
    if (el.visible === false) continue;

    ctx.save();
    const posX = (el.x / 100) * width;
    const posY = (el.y / 100) * height;

    switch (el.type) {
      case 'photo': {
        const pWidth =
          el.width !== undefined
            ? typeof el.width === 'number' && el.width <= 100
              ? (el.width / 100) * width
              : el.width
            : 144;
        const pHeight =
          el.height !== undefined
            ? typeof el.height === 'number' && el.height <= 100
              ? (el.height / 100) * height
              : el.height
            : 148;

        const isCentered = el.align === 'center';
        const actualX = isCentered ? posX - pWidth / 2 : posX;
        const radius =
          el.borderRadius !== undefined
            ? el.borderRadius <= 50
              ? (el.borderRadius / 100) * pWidth
              : el.borderRadius
            : 4;

        if (memberPhotoImg) {
          ctx.save();
          ctx.beginPath();
          roundRect(ctx, actualX, posY, pWidth, pHeight, radius);
          ctx.clip();
          ctx.drawImage(memberPhotoImg, actualX, posY, pWidth, pHeight);
          ctx.restore();
        } else {
          drawDefaultCertificateAvatar(ctx, actualX, posY, pWidth, pHeight, radius, params.member.fullName);
        }
        break;
      }

      case 'name': {
        const fontSize = el.fontSize || 28;
        const fontWeight = el.fontWeight || 'bold';
        ctx.font = `${fontWeight} ${fontSize}px Nyala, Arial, sans-serif`;
        ctx.fillStyle = el.color || '#1E1B18';
        ctx.textAlign = el.align || 'center';
        ctx.textBaseline = 'middle';

        // Subtle warm glow/shadow for certificate elegance
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;

        ctx.fillText(params.member.fullName, posX, posY);
        break;
      }

      case 'memberId': {
        const fontSize = el.fontSize || 13;
        ctx.font = `${el.fontWeight || 'bold'} ${fontSize}px monospace, Arial`;
        ctx.fillStyle = el.color || '#6B5B4D';
        ctx.textAlign = el.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`ID: ${params.member.membershipCode}`, posX, posY);
        break;
      }

      case 'issueDate': {
        const rawDate = params.member.approvedAt || params.member.createdAt || new Date();
        const dateStr = new Date(rawDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const fontSize = el.fontSize || 12;
        ctx.font = `${el.fontWeight || '500'} ${fontSize}px Nyala, Arial, sans-serif`;
        ctx.fillStyle = el.color || '#8A7A6D';
        ctx.textAlign = el.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Issued: ${dateStr}`, posX, posY);
        break;
      }

      case 'tier': {
        const fontSize = el.fontSize || 16;
        ctx.font = `${el.fontWeight || 'bold'} ${fontSize}px Nyala, Arial, sans-serif`;
        ctx.fillStyle = el.color || '#D97706';
        ctx.textAlign = el.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${(params.member.tierName || 'Member').toUpperCase()} MEMBER`, posX, posY);
        break;
      }

      case 'customText': {
        const fontSize = el.fontSize || 18;
        ctx.font = `${el.fontWeight || 'normal'} ${fontSize}px Nyala, Arial, sans-serif`;
        ctx.fillStyle = el.color || '#1E1B18';
        ctx.textAlign = el.align || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.customText || '', posX, posY);
        break;
      }

      case 'qr': {
        if (qrImage) {
          const qrWidth =
            el.width !== undefined
              ? typeof el.width === 'number' && el.width <= 100
                ? (el.width / 100) * width
                : el.width
              : 70;
          const qrHeight =
            el.height !== undefined
              ? typeof el.height === 'number' && el.height <= 100
                ? (el.height / 100) * height
                : el.height
              : qrWidth;
          const isCentered = el.align === 'center';
          const actualX = isCentered ? posX - qrWidth / 2 : posX;

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          roundRect(ctx, actualX - 2, posY - 2, qrWidth + 4, qrHeight + 4, 6);
          ctx.fill();

          ctx.drawImage(qrImage, actualX, posY, qrWidth, qrHeight);
        }
        break;
      }
    }

    ctx.restore();
  }

  return canvas.toBuffer('image/png');
}
