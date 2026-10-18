export interface CertificateElementConfig {
  id: string;
  type: 'name' | 'photo' | 'qr' | 'memberId' | 'issueDate' | 'customText' | 'tier';
  label: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width?: number; // percentage (0 - 100) or px
  height?: number; // percentage (0 - 100) or px
  fontFamily?: string;
  fontSize?: number; // px at base canvas (e.g. 28)
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
  letterSpacing?: number;
  borderRadius?: number; // percentage e.g. 4 for frame, 50 for circle
  customText?: string;
  visible?: boolean;
}

export interface CertificateTemplateConfig {
  width: number;
  height: number;
  aspectRatio: string;
  baseDesignUrl?: string | null;
  backgroundColor?: string;
  elements: CertificateElementConfig[];
}

export const CERTIFICATE_PRESETS = [
  { label: 'Donkey Tube Tentative (1024 : 712)', value: '1024:712', w: 1024, h: 712 },
  { label: 'A4 Landscape (1123 : 794)', value: '1123:794', w: 1123, h: 794 },
  { label: 'Standard 16:9 (1280 : 720)', value: '16:9', w: 1280, h: 720 },
  { label: 'Classic 4:3 (1024 : 768)', value: '4:3', w: 1024, h: 768 },
];

export const DEFAULT_CERTIFICATE_TEMPLATE: CertificateTemplateConfig = {
  width: 1024,
  height: 712,
  aspectRatio: '1024:712',
  baseDesignUrl: '/certificate/default-certificate.jpg',
  backgroundColor: '#FFFDF9',
  elements: [
    {
      id: 'photo-1',
      type: 'photo',
      label: 'Member Photo (የአባል ፎቶ)',
      x: 74.2,
      y: 7.3,
      width: 14.1,
      height: 20.8,
      borderRadius: 4,
      visible: true,
    },
    {
      id: 'name-1',
      type: 'name',
      label: 'Member Name (የአባል ስም)',
      x: 50,
      y: 41.5,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1E1B18',
      align: 'center',
      fontFamily: 'Nyala, serif',
      visible: true,
    },
    {
      id: 'memberId-1',
      type: 'memberId',
      label: 'Member ID Code (የአባል መለያ)',
      x: 50,
      y: 84,
      fontSize: 13,
      fontWeight: 'bold',
      color: '#6B5B4D',
      align: 'center',
      fontFamily: 'monospace',
      visible: true,
    },
    {
      id: 'issueDate-1',
      type: 'issueDate',
      label: 'Issue Date (የተሰጠበት ቀን)',
      x: 50,
      y: 88,
      fontSize: 12,
      fontWeight: '500',
      color: '#8A7A6D',
      align: 'center',
      visible: true,
    },
    {
      id: 'qr-1',
      type: 'qr',
      label: 'Verification QR Code (ማረጋገጫ QR)',
      x: 46.5,
      y: 72,
      width: 7,
      height: 10,
      visible: false,
    },
  ],
};
