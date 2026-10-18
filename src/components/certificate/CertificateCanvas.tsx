'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { User, QrCode as QrIcon } from 'lucide-react';
import { CertificateElementConfig, CertificateTemplateConfig, DEFAULT_CERTIFICATE_TEMPLATE } from '@/lib/certificate-types';

export interface CertificateMember {
  fullName: string;
  membershipCode: string;
  photoUrl?: string | null;
  tierName?: string;
  approvedAt?: string | Date | null;
  createdAt?: string | Date | null;
}

interface CertificateCanvasProps {
  member: CertificateMember;
  template?: CertificateTemplateConfig | null;
  className?: string;
  interactive?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  onMouseDownElement?: (e: React.MouseEvent, el: CertificateElementConfig) => void;
  onResizeDownElement?: (e: React.MouseEvent, el: CertificateElementConfig) => void;
  isDragging?: boolean;
}

export function CertificateCanvas({
  member,
  template,
  className = '',
  interactive = false,
  selectedElementId,
  onSelectElement,
  onMouseDownElement,
  onResizeDownElement,
  isDragging = false,
}: CertificateCanvasProps) {
  const [realQrUrl, setRealQrUrl] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const elements =
    template?.elements && Array.isArray(template.elements)
      ? template.elements
      : DEFAULT_CERTIFICATE_TEMPLATE.elements;

  const aspectRatio = (template?.aspectRatio || '1024:712').replace(':', '/');
  const baseDesignUrl = template?.baseDesignUrl || DEFAULT_CERTIFICATE_TEMPLATE.baseDesignUrl;

  // Generate genuine high-contrast QR Code if QR element exists
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
        console.error('Failed to generate real QR code for certificate:', err);
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

  return (
    <div
      style={{
        aspectRatio,
        width: '100%',
        backgroundImage: baseDesignUrl ? `url(${baseDesignUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        containerType: 'inline-size',
      }}
      className={`relative rounded-2xl overflow-hidden shadow-2xl border border-amber-600/30 select-none transition-all ${
        !baseDesignUrl ? 'bg-gradient-to-br from-[#FFFDF7] via-[#FFFDF5] to-[#F9F5EC]' : ''
      } ${className}`}
    >
      {/* Dynamic Certificate Layers */}
      {elements.map((el) => {
        if (el.visible === false) return null;

        const isSelected = selectedElementId === el.id;
        const isCentered = el.align === 'center';
        const isPhotoOrQr = el.type === 'photo' || el.type === 'qr';

        const widthVal =
          el.width !== undefined
            ? typeof el.width === 'number' && el.width <= 100
              ? `${el.width}%`
              : `${el.width}px`
            : undefined;

        const heightVal =
          el.height !== undefined
            ? typeof el.height === 'number' && el.height <= 100
              ? `${el.height}%`
              : `${el.height}px`
            : undefined;

        // Container-relative responsive font sizing
        // Base canvas is ~1024px width
        const baseFontSize = el.fontSize || 24;
        const fontSizeResponsive = `clamp(9px, ${(baseFontSize * 0.098).toFixed(3)}cqw, ${(baseFontSize * 1.1).toFixed(1)}px)`;

        return (
          <div
            key={el.id}
            data-element-id={el.id}
            data-element-type={el.type}
            onMouseDown={(e) => {
              if (interactive && onMouseDownElement) {
                onMouseDownElement(e, el);
              }
            }}
            onClick={(e) => {
              if (interactive && onSelectElement) {
                e.stopPropagation();
                onSelectElement(el.id);
              }
            }}
            style={{
              position: 'absolute',
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: widthVal,
              height: heightVal,
              transform: isCentered ? 'translate(-50%, 0)' : undefined,
              color: el.color || '#1E1B18',
              fontFamily: el.fontFamily || 'Nyala, Arial, sans-serif',
              fontSize: fontSizeResponsive,
              fontWeight: el.fontWeight || 'bold',
              opacity: el.opacity ?? 1,
              textAlign: el.align || 'left',
              cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'default',
              zIndex: isSelected ? 30 : isPhotoOrQr ? 10 : 20,
              whiteSpace:
                el.type === 'name' || el.type === 'memberId' || el.type === 'issueDate' || el.type === 'tier'
                  ? 'nowrap'
                  : undefined,
            }}
            className={`certificate-layer transition-shadow rounded ${
              interactive && isSelected
                ? 'ring-2 ring-amber-500 bg-amber-500/10 shadow-lg'
                : interactive
                ? 'hover:ring-1 hover:ring-amber-500/40'
                : ''
            }`}
          >
            {/* Member Photo */}
            {el.type === 'photo' && (() => {
              const isExpiredNotionUrl =
                member.photoUrl &&
                (member.photoUrl.includes('prod-files-secure.s3') ||
                  member.photoUrl.includes('secure.notion-static') ||
                  member.photoUrl.includes('s3.us-west-2.amazonaws.com'));

              const borderRadiusVal =
                el.borderRadius !== undefined
                  ? el.borderRadius <= 50
                    ? `${el.borderRadius}%`
                    : `${el.borderRadius}px`
                  : '4px';

              return (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: borderRadiusVal,
                  }}
                  className="relative overflow-hidden bg-amber-100/60 border border-amber-300/40 shadow-inner flex items-center justify-center"
                >
                  {member.photoUrl && !imgFailed && !isExpiredNotionUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800">
                      <span className="font-extrabold text-2xl tracking-tighter">
                        {member.fullName ? member.fullName.trim().charAt(0).toUpperCase() : 'E'}
                      </span>
                    </div>
                  )}

                  {/* Resize handle in interactive studio mode */}
                  {interactive && isSelected && onResizeDownElement && (
                    <div
                      onMouseDown={(e) => onResizeDownElement(e, el)}
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-500 border border-white cursor-se-resize rounded-tl shadow"
                    />
                  )}
                </div>
              );
            })()}

            {/* Member Full Name */}
            {el.type === 'name' && (
              <span className="font-extrabold tracking-tight block drop-shadow-sm">
                {member.fullName}
              </span>
            )}

            {/* Member ID */}
            {el.type === 'memberId' && (
              <span className="font-mono tracking-wider font-bold">
                ID: {member.membershipCode}
              </span>
            )}

            {/* Issue Date */}
            {el.type === 'issueDate' && (
              <span className="tracking-wide">
                Issued: {formattedDate}
              </span>
            )}

            {/* Tier Name */}
            {el.type === 'tier' && (
              <span className="font-bold uppercase tracking-wider text-amber-700">
                {(member.tierName || 'Member').toUpperCase()} MEMBER
              </span>
            )}

            {/* Custom Text */}
            {el.type === 'customText' && (
              <span>{el.customText || 'CUSTOM TEXT'}</span>
            )}

            {/* Verification QR */}
            {el.type === 'qr' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: el.borderRadius ? `${el.borderRadius}px` : '6px',
                }}
                className="bg-white p-1 rounded shadow-md flex items-center justify-center overflow-hidden border border-amber-200"
              >
                {realQrUrl ? (
                  <img
                    src={realQrUrl}
                    alt={`Verification QR for ${member.membershipCode}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrIcon className="w-full h-full text-slate-900" />
                )}

                {interactive && isSelected && onResizeDownElement && (
                  <div
                    onMouseDown={(e) => onResizeDownElement(e, el)}
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-500 border border-white cursor-se-resize rounded-tl shadow"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
