'use client';

import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { QrCode, User } from 'lucide-react';
import { CardElementConfig, DEFAULT_CARD_TEMPLATE } from '@/lib/card-types';

export interface DigitalPassMember {
  fullName: string;
  membershipCode: string;
  photoUrl?: string | null;
  tierName?: string;
  badgeColor?: string;
  approvedAt?: string | Date | null;
  createdAt?: string | Date | null;
}

export interface DigitalPassTemplate {
  width?: number;
  height?: number;
  aspectRatio?: string;
  baseDesignUrl?: string | null;
  layoutConfig?: CardElementConfig[];
}

interface DigitalCardCanvasProps {
  member: DigitalPassMember;
  template?: DigitalPassTemplate | null;
  fallbackImageUrl?: string | null;
  className?: string;
  scale?: number; // scale multiplier for font and sizes if needed
  id?: string;
}

export function DigitalCardCanvas({
  member,
  template,
  fallbackImageUrl,
  className = '',
  id,
}: DigitalCardCanvasProps) {
  const [realQrUrl, setRealQrUrl] = useState<string | null>(null);

  const elements =
    template?.layoutConfig && Array.isArray(template.layoutConfig)
      ? template.layoutConfig
      : DEFAULT_CARD_TEMPLATE.elements;

  const aspectRatio = (template?.aspectRatio || '85.60:53.98').replace(':', '/');
  const baseDesignUrl = template?.baseDesignUrl;

  // Generate genuine high-contrast, scannable QR Code
  useEffect(() => {
    let isMounted = true;
    async function generateQr() {
      if (!member.membershipCode) return;
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const verifyUrl = `${origin}/card/${encodeURIComponent(member.membershipCode)}`;
        const url = await QRCode.toDataURL(verifyUrl, {
          margin: 1,
          width: 320,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        if (isMounted) setRealQrUrl(url);
      } catch (err) {
        console.error('Failed to generate real QR code:', err);
      }
    }
    generateQr();
    return () => {
      isMounted = false;
    };
  }, [member.membershipCode]);

  const formattedDate = React.useMemo(() => {
    try {
      const d = member.approvedAt || member.createdAt || new Date();
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Sep 11, 2026';
    }
  }, [member]);

  // If no template base design and a fallback pre-rendered image is available, we can render it or the canvas
  if (!baseDesignUrl && fallbackImageUrl && (!template?.layoutConfig || template.layoutConfig.length === 0)) {
    return (
      <div id={id} className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/50 ${className}`}>
        <img
          src={fallbackImageUrl}
          alt={`${member.fullName} Pass`}
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div
      id={id}
      style={{
        aspectRatio,
        width: '100%',
        backgroundImage: baseDesignUrl ? `url(${baseDesignUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        containerType: 'inline-size',
      }}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/50 select-none transition-all ${
        !baseDesignUrl ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950' : ''
      } ${className}`}
    >
      {/* Subtle Visual Guidelines Border */}
      <div className="absolute inset-3 sm:inset-4 border border-amber-500/20 rounded-2xl pointer-events-none" />

      {/* Render Each Positioned Dynamic Element from Card Studio */}
      {elements.map((el) => {
        if (el.visible === false) return null;

        const isCentered = el.align === 'center';
        const isPhotoOrQr = el.type === 'photo' || el.type === 'qr';
        const widthVal =
          el.width !== undefined
            ? typeof el.width === 'number' && el.width <= 100
              ? `${el.width}%`
              : `${el.width}px`
            : undefined;
        // For photo and QR, aspect ratio is 1:1, so height should be 'auto' or dictated by width
        const heightVal = isPhotoOrQr
          ? undefined
          : el.height !== undefined
            ? typeof el.height === 'number' && el.height <= 100
              ? `${el.height}%`
              : `${el.height}px`
            : undefined;

        // Container-relative responsive font sizing matching Studio 750px max-width canvas exactly:
        // Studio uses: (el.fontSize * 0.75)px at ~750px width -> (fontSize * 0.75 / 750 * 100) = fontSize * 0.1 cqw
        const baseFontSize = el.fontSize || 20;
        const fontSizeResponsive = `clamp(9px, ${(baseFontSize * 0.1).toFixed(3)}cqw, ${(baseFontSize * 0.85).toFixed(1)}px)`;

        return (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: widthVal,
              height: heightVal,
              aspectRatio: isPhotoOrQr ? '1 / 1' : undefined,
              transform: isCentered ? 'translate(-50%, 0)' : undefined,
              color: el.color || '#FFFFFF',
              fontFamily: el.fontFamily || 'sans-serif',
              fontSize: fontSizeResponsive,
              fontWeight: el.fontWeight || 'normal',
              opacity: el.opacity ?? 1,
              textAlign: el.align || 'left',
              zIndex: isPhotoOrQr ? 10 : 20,
              maxWidth: el.type === 'name' || el.type === 'memberId' ? (isCentered ? '80%' : '52%') : undefined,
              whiteSpace: el.type === 'name' || el.type === 'memberId' || el.type === 'tier' ? 'nowrap' : undefined,
            }}
            className="select-none leading-tight"
          >
            {el.type === 'logo' && (
              <span className="font-extrabold tracking-wider">
                {el.customText || 'ESHETU MELESE COMMUNITY'}
              </span>
            )}

            {el.type === 'name' && (
              <span className="font-extrabold tracking-tight block truncate drop-shadow-md">
                {member.fullName.toUpperCase()}
              </span>
            )}

            {el.type === 'tier' && (
              <span className="font-bold uppercase text-amber-400 drop-shadow">
                {(member.tierName || 'MEMBER').toUpperCase()}
              </span>
            )}

            {el.type === 'memberId' && (
              <span className="font-mono tracking-wider drop-shadow">
                {member.membershipCode}
              </span>
            )}

            {el.type === 'issueDate' && (
              <span className="text-xs">ISSUED: {formattedDate}</span>
            )}

            {el.type === 'customText' && (
              <span className="font-semibold">{el.customText || ''}</span>
            )}

            {el.type === 'qr' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                }}
                className="bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-slate-200"
              >
                {realQrUrl ? (
                  <img
                    src={realQrUrl}
                    alt={`Verification QR for ${member.membershipCode}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-full h-full text-slate-950" />
                )}
              </div>
            )}

            {el.type === 'photo' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: el.borderRadius ? `${el.borderRadius}%` : '50%',
                }}
                className="border-2 border-slate-900/60 bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center"
              >
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-400 text-2xl font-bold bg-slate-900">
                    <User className="w-1/2 h-1/2 text-amber-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
