import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import { saveBase64Image } from './storage';

export interface CardElementConfig {
  id: string;
  type: 'name' | 'memberId' | 'tier' | 'qr' | 'barcode' | 'photo' | 'issueDate' | 'expiryDate' | 'logo' | 'customText';
  label: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width?: number; // percentage or px
  height?: number; // percentage or px
  fontFamily?: string;
  fontSize?: number; // px at base canvas
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
  letterSpacing?: number;
  borderRadius?: number;
  customText?: string;
  visible?: boolean;
}

export interface CardTemplateConfig {
  width: number;
  height: number;
  aspectRatio: string;
  baseDesignUrl?: string;
  backgroundColor?: string;
  elements: CardElementConfig[];
}

export const DEFAULT_CARD_TEMPLATE: CardTemplateConfig = {
  width: 1050,
  height: 600,
  aspectRatio: '85.60:53.98',
  backgroundColor: '#0F172A',
  elements: [
    {
      id: 'logo-1',
      type: 'logo',
      label: 'Portal Logo/Header',
      x: 6,
      y: 8,
      fontSize: 24,
      fontWeight: 'bold',
      color: '#D4AF37',
      align: 'left',
      customText: 'ESHETU MELESE COMMUNITY',
      visible: true,
    },
    {
      id: 'photo-1',
      type: 'photo',
      label: 'Member Photo',
      x: 6,
      y: 28,
      width: 150,
      height: 150,
      borderRadius: 75, // circle
      visible: true,
    },
    {
      id: 'name-1',
      type: 'name',
      label: 'Full Name',
      x: 25,
      y: 35,
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      align: 'left',
      visible: true,
    },
    {
      id: 'tier-1',
      type: 'tier',
      label: 'Membership Tier',
      x: 25,
      y: 48,
      fontSize: 22,
      fontWeight: '600',
      color: '#E5A93C',
      align: 'left',
      visible: true,
    },
    {
      id: 'id-1',
      type: 'memberId',
      label: 'Member ID',
      x: 25,
      y: 60,
      fontSize: 18,
      fontWeight: '500',
      color: '#94A3B8',
      align: 'left',
      visible: true,
    },
    {
      id: 'issueDate-1',
      type: 'issueDate',
      label: 'Issue Date',
      x: 25,
      y: 72,
      fontSize: 16,
      fontWeight: '400',
      color: '#64748B',
      align: 'left',
      visible: true,
    },
    {
      id: 'qr-1',
      type: 'qr',
      label: 'Verification QR Code',
      x: 75,
      y: 28,
      width: 170,
      height: 170,
      visible: true,
    },
  ],
};

export async function generateMembershipBadgeImage(params: {
  member: {
    membershipCode: string;
    fullName: string;
    photoUrl?: string | null;
    tierName: string;
    approvedAt?: Date | null;
  };
  templateConfig?: CardTemplateConfig;
  siteUrl?: string;
}): Promise<string> {
  const config = params.templateConfig || DEFAULT_CARD_TEMPLATE;
  const width = config.width || 1050;
  const height = config.height || 600;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Draw Background
  if (config.baseDesignUrl) {
    try {
      let bgImg: any = null;
      if (config.baseDesignUrl.startsWith('data:')) {
        bgImg = await loadImage(config.baseDesignUrl);
      } else if (config.baseDesignUrl.startsWith('http')) {
        const resp = await fetch(config.baseDesignUrl);
        const buf = await resp.arrayBuffer();
        bgImg = await loadImage(Buffer.from(buf));
      } else {
        const fullPath = path.join(process.cwd(), 'public', config.baseDesignUrl.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          bgImg = await loadImage(fullPath);
        }
      }

      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        drawDefaultLuxuryBackground(ctx, width, height);
      }
    } catch {
      drawDefaultLuxuryBackground(ctx, width, height);
    }
  } else {
    drawDefaultLuxuryBackground(ctx, width, height);
  }

  // 2. Generate QR Code Data URL
  const siteUrl = params.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const verifyUrl = `${siteUrl}/card/${params.member.membershipCode}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: { dark: '#000000', light: '#FFFFFF' },
    width: 300,
  });
  const qrImage = await loadImage(qrDataUrl);

  // 3. Render Elements
  for (const el of config.elements) {
    if (el.visible === false) continue;

    const posX = (el.x / 100) * width;
    const posY = (el.y / 100) * height;

    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;

    switch (el.type) {
      case 'logo': {
        const text = el.customText || 'ESHETU MELESE COMMUNITY';
        ctx.font = `${el.fontWeight || 'bold'} ${el.fontSize || 24}px sans-serif`;
        ctx.fillStyle = el.color || '#D4AF37';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(text, posX, posY);
        break;
      }
      case 'name': {
        ctx.font = `${el.fontWeight || 'bold'} ${el.fontSize || 32}px sans-serif`;
        ctx.fillStyle = el.color || '#FFFFFF';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(params.member.fullName.toUpperCase(), posX, posY);
        break;
      }
      case 'tier': {
        ctx.font = `${el.fontWeight || '600'} ${el.fontSize || 22}px sans-serif`;
        ctx.fillStyle = el.color || '#E5A93C';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(`${params.member.tierName.toUpperCase()} MEMBER`, posX, posY);
        break;
      }
      case 'memberId': {
        ctx.font = `${el.fontWeight || '500'} ${el.fontSize || 18}px monospace`;
        ctx.fillStyle = el.color || '#94A3B8';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(`ID: ${params.member.membershipCode}`, posX, posY);
        break;
      }
      case 'issueDate': {
        const dateStr = params.member.approvedAt
          ? new Date(params.member.approvedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        ctx.font = `${el.fontWeight || '400'} ${el.fontSize || 16}px sans-serif`;
        ctx.fillStyle = el.color || '#64748B';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(`ISSUED: ${dateStr}`, posX, posY);
        break;
      }
      case 'customText': {
        ctx.font = `${el.fontWeight || 'normal'} ${el.fontSize || 20}px sans-serif`;
        ctx.fillStyle = el.color || '#FFFFFF';
        ctx.textAlign = el.align || 'left';
        ctx.fillText(el.customText || '', posX, posY);
        break;
      }
      case 'qr': {
        const qrWidth = el.width !== undefined
          ? (typeof el.width === 'number' && el.width <= 100 ? (el.width / 100) * width : el.width)
          : 160;
        const qrHeight = el.height !== undefined
          ? (typeof el.height === 'number' && el.height <= 100 ? (el.height / 100) * height : el.height)
          : qrWidth;
        const isCentered = el.align === 'center';
        const actualX = isCentered ? posX - (qrWidth / 2) : posX;

        // Background card behind QR for contrast
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        roundRect(ctx, actualX - 4, posY - 4, qrWidth + 8, qrHeight + 8, 12);
        ctx.fill();
        ctx.drawImage(qrImage, actualX, posY, qrWidth, qrHeight);
        break;
      }
      case 'photo': {
        const pWidth = el.width !== undefined
          ? (typeof el.width === 'number' && el.width <= 100 ? (el.width / 100) * width : el.width)
          : 140;
        const pHeight = el.height !== undefined
          ? (typeof el.height === 'number' && el.height <= 100 ? (el.height / 100) * height : el.height)
          : pWidth;
        const isCentered = el.align === 'center';
        const actualX = isCentered ? posX - (pWidth / 2) : posX;
        const radius = el.borderRadius !== undefined ? (el.borderRadius <= 50 ? (el.borderRadius / 100) * pWidth : el.borderRadius) : pWidth / 2;

        if (params.member.photoUrl) {
          try {
            let photoImg: any = null;
            if (params.member.photoUrl.startsWith('data:')) {
              photoImg = await loadImage(params.member.photoUrl);
            } else if (params.member.photoUrl.startsWith('http')) {
              const pResp = await fetch(params.member.photoUrl);
              const pBuf = await pResp.arrayBuffer();
              photoImg = await loadImage(Buffer.from(pBuf));
            } else {
              const photoPath = path.join(process.cwd(), 'public', params.member.photoUrl.replace(/^\//, ''));
              if (fs.existsSync(photoPath)) {
                photoImg = await loadImage(photoPath);
              }
            }

            if (photoImg) {
              ctx.beginPath();
              roundRect(ctx, actualX, posY, pWidth, pHeight, radius);
              ctx.clip();
              ctx.drawImage(photoImg, actualX, posY, pWidth, pHeight);
            } else {
              drawDefaultAvatar(ctx, actualX, posY, pWidth, pHeight, radius, params.member.fullName);
            }
          } catch {
            drawDefaultAvatar(ctx, actualX, posY, pWidth, pHeight, radius, params.member.fullName);
          }
        } else {
          drawDefaultAvatar(ctx, actualX, posY, pWidth, pHeight, radius, params.member.fullName);
        }
        break;
      }
    }
    ctx.restore();
  }

  // Convert canvas to Data URL and save file
  const base64Data = canvas.toDataURL('image/png');
  const storedUrl = await saveBase64Image(base64Data, 'cards', `card-${params.member.membershipCode}`);
  return storedUrl;
}

function drawDefaultLuxuryBackground(ctx: any, width: number, height: number) {
  // Deep luxurious gradient with gold accents
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(0.5, '#1E293B');
  grad.addColorStop(1, '#090D16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Gold Border Outline
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // Geometric luxury lines
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.75);
  ctx.lineTo(width * 0.4, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width * 0.6, 0);
  ctx.lineTo(width, height * 0.35);
  ctx.stroke();
}

function drawDefaultAvatar(ctx: any, x: number, y: number, w: number, h: number, radius: number, name: string) {
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Initial letter
  const initial = name ? name.charAt(0).toUpperCase() : 'M';
  ctx.font = `bold ${Math.floor(w * 0.45)}px sans-serif`;
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, x + w / 2, y + h / 2);
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
