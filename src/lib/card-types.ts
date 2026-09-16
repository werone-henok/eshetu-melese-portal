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
      x: 4.8,
      y: 13.5,
      width: 33.5,
      height: 33.5,
      borderRadius: 50,
      visible: true,
    },
    {
      id: 'name-1',
      type: 'name',
      label: 'Full Name',
      x: 41,
      y: 44,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      align: 'left',
      visible: true,
    },
    {
      id: 'tier-1',
      type: 'tier',
      label: 'Membership Tier',
      x: 41,
      y: 52,
      fontSize: 20,
      fontWeight: '600',
      color: '#E5A93C',
      align: 'left',
      visible: false,
    },
    {
      id: 'id-1',
      type: 'memberId',
      label: 'Member ID',
      x: 41,
      y: 57,
      fontSize: 16,
      fontWeight: '600',
      color: '#F59E0B',
      align: 'left',
      visible: true,
    },
    {
      id: 'issueDate-1',
      type: 'issueDate',
      label: 'Issue Date',
      x: 41,
      y: 64,
      fontSize: 14,
      fontWeight: '400',
      color: '#64748B',
      align: 'left',
      visible: false,
    },
    {
      id: 'qr-1',
      type: 'qr',
      label: 'Verification QR Code',
      x: 41,
      y: 66,
      width: 19,
      height: 19,
      visible: true,
    },
  ],
};
