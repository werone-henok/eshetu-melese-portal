export interface CountryItem {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export const COUNTRIES: CountryItem[] = [
  { name: 'Ethiopia', code: 'ET', dial_code: '+251', flag: '🇪🇹' },
  { name: 'United States', code: 'US', dial_code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dial_code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dial_code: '+1', flag: '🇨🇦' },
  { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dial_code: '+966', flag: '🇸🇦' },
  { name: 'Germany', code: 'DE', dial_code: '+49', flag: '🇩🇪' },
  { name: 'Israel', code: 'IL', dial_code: '+972', flag: '🇮🇱' },
  { name: 'Sweden', code: 'SE', dial_code: '+46', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', dial_code: '+47', flag: '🇳🇴' },
  { name: 'Italy', code: 'IT', dial_code: '+39', flag: '🇮🇹' },
  { name: 'Kenya', code: 'KE', dial_code: '+254', flag: '🇰🇪' },
  { name: 'Djibouti', code: 'DJ', dial_code: '+253', flag: '🇩🇯' },
  { name: 'Sudan', code: 'SD', dial_code: '+249', flag: '🇸🇩' },
  { name: 'South Africa', code: 'ZA', dial_code: '+27', flag: '🇿🇦' },
  { name: 'Australia', code: 'AU', dial_code: '+61', flag: '🇦🇺' },
  { name: 'Netherlands', code: 'NL', dial_code: '+31', flag: '🇳🇱' },
  { name: 'France', code: 'FR', dial_code: '+33', flag: '🇫🇷' },
  { name: 'Switzerland', code: 'CH', dial_code: '+41', flag: '🇨🇭' },
  { name: 'Qatar', code: 'QA', dial_code: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', code: 'KW', dial_code: '+965', flag: '🇰🇼' },
  { name: 'Bahrain', code: 'BH', dial_code: '+973', flag: '🇧🇭' },
  { name: 'Turkey', code: 'TR', dial_code: '+90', flag: '🇹🇷' },
  { name: 'China', code: 'CN', dial_code: '+86', flag: '🇨🇳' },
  { name: 'India', code: 'IN', dial_code: '+91', flag: '🇮🇳' },
];

/**
 * Normalizes phone numbers for storage, lookup and duplicate detection.
 * Example: countryCode="+251", phone="0911234567" -> "+251911234567"
 * Example: countryCode="+1", phone="(555) 019-2834" -> "+15550192834"
 */
export function normalizePhoneNumber(countryCode: string, rawPhone: string): string {
  const cleanCode = countryCode.trim().startsWith('+') ? countryCode.trim() : `+${countryCode.trim()}`;
  let cleanPhone = rawPhone.replace(/\D/g, ''); // strip all non-digits

  // If local leading zero exists, strip it (e.g. 0911234567 -> 911234567 in ET)
  if (cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.substring(1);
  }

  // Avoid double country code if user pasted with dial code
  const codeDigits = cleanCode.replace('+', '');
  if (cleanPhone.startsWith(codeDigits)) {
    cleanPhone = cleanPhone.substring(codeDigits.length);
  }

  return `${cleanCode}${cleanPhone}`;
}
