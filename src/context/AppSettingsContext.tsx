'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'am';
type ColorMode = 'dark' | 'light';

export interface SiteBranding {
  siteName: string;
  siteNameAm: string;
  tagline: string;
  taglineAm: string;
  logoUrl: string;
  faviconUrl: string;
  paymentInstructions?: string;
  paymentInstructionsAm?: string;
}

export const DEFAULT_BRANDING: SiteBranding = {
  siteName: 'ESHETU MELESE',
  siteNameAm: 'እሸቱ መለሰ',
  tagline: 'Official Member Portal',
  taglineAm: 'ይፋዊ የአባላት ፖርታል',
  logoUrl: '',
  faviconUrl: '',
  paymentInstructions: 'Please deposit the membership fee via Commercial Bank of Ethiopia (CBE): 1000234567890 (Eshetu Melese) or Telebirr: 0911234567. Then upload your deposit receipt or transfer screenshot below.',
  paymentInstructionsAm: 'እባክዎ የአባልነት መዋጮ ክፍያዎን በኢትዮጵያ ንግድ ባንክ (CBE) ሂሳብ ቁጥር፡ 1000234567890 (እሸቱ መለሰ) ወይም በቴሌብር (Telebirr) ቁጥር፡ 0911234567 ገቢ ያድርጉ። በመቀጠል የደረሰኙን ስክሪንሾት ወይም ፎቶ ከዚህ በታች ያያይዙ።',
};

interface AppSettingsContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  branding: SiteBranding;
  setBranding: (branding: SiteBranding) => void;
  updateBranding: (newBranding: Partial<SiteBranding>) => void;
  t: (key: string, defaultEn?: string, defaultAm?: string) => string;
}

const DICTIONARY: Record<string, { en: string; am: string }> = {
  // Navigation
  'nav.home': { en: 'Home', am: 'ዋና ገጽ' },
  'nav.about': { en: 'About Eshetu', am: 'ስለ እሸቱ መለሰ' },
  'nav.charity': { en: 'Lmetsdek Charity', am: 'ለመጽደቅ በጎ አድራጎት' },
  'nav.events': { en: 'Upcoming Events', am: 'መጪ ዝግጅቶች' },
  'nav.benefits': { en: 'Benefits', am: 'ጥቅማ ጥቅሞች' },
  'nav.tiers': { en: 'Membership Tiers', am: 'የአባልነት ደረጃዎች' },
  'nav.howItWorks': { en: 'How It Works', am: 'አሰራሩ' },
  'nav.faq': { en: 'FAQ', am: 'ተደጋጋሚ ጥያቄዎች' },
  'nav.verify': { en: 'Verify Card', am: 'ካርድ አረጋግጥ' },
  'nav.joinNow': { en: 'Join Now', am: 'አባል ይሁኑ' },
  'nav.contact': { en: 'Contact Us', am: 'ያግኙን' },
  'nav.talk': { en: 'Let’s Talk', am: 'እንነጋገር' },
  // General Buttons
  'btn.register': { en: 'Get Your Membership Card', am: 'የአባልነት ካርድዎን ያግኙ' },
  'btn.verify': { en: 'Verify / Search Card', am: 'ካርድ ያረጋግጡ / ይፈልጉ' },
  'btn.submit': { en: 'Submit Application', am: 'ማመልከቻ ያስገቡ' },
  // Common Labels
  'label.phone': { en: 'Phone Number (International)', am: 'ስልክ ቁጥር (አለምአቀፍ)' },
  'label.fullName': { en: 'Full Name', am: 'ሙሉ ስም' },
  'label.tier': { en: 'Membership Tier', am: 'የአባልነት ደረጃ' },
  'label.paymentMethod': { en: 'Payment Method', am: 'የክፍያ ዘዴ' },
  'label.paymentProof': { en: 'Payment Receipt / Screenshot', am: 'የክፍያ ደረሰኝ' },
  'label.contactUsForShield': { en: 'Contact Us / Let’s Talk', am: 'ያግኙን / እንነጋገር' },
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [colorMode, setColorModeState] = useState<ColorMode>('dark');
  const [branding, setBrandingState] = useState<SiteBranding>(DEFAULT_BRANDING);

  useEffect(() => {
    const savedLang = localStorage.getItem('eshetu_lang') as Language;
    if (savedLang === 'en' || savedLang === 'am') {
      setLangState(savedLang);
    }
    const savedMode = localStorage.getItem('eshetu_color_mode') as ColorMode;
    if (savedMode === 'dark' || savedMode === 'light') {
      setColorModeState(savedMode);
      document.documentElement.classList.toggle('light', savedMode === 'light');
      document.documentElement.classList.toggle('dark', savedMode === 'dark');
    }

    // Load site branding from API
    async function loadBranding() {
      try {
        const res = await fetch('/api/cms/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.branding) {
            setBrandingState(data.branding);
          }
        }
      } catch (err) {
        console.error('Failed to load branding:', err);
      }
    }
    loadBranding();
  }, []);

  // Update browser tab favicon dynamically
  useEffect(() => {
    const iconUrl = branding.faviconUrl || branding.logoUrl;
    if (iconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = iconUrl;
    }
  }, [branding.faviconUrl, branding.logoUrl]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('eshetu_lang', newLang);
  };

  const setColorMode = (newMode: ColorMode) => {
    setColorModeState(newMode);
    localStorage.setItem('eshetu_color_mode', newMode);
    document.documentElement.classList.toggle('light', newMode === 'light');
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark');
  };

  const setBranding = (newBranding: SiteBranding) => {
    setBrandingState(newBranding);
  };

  const updateBranding = (partial: Partial<SiteBranding>) => {
    setBrandingState((prev) => ({ ...prev, ...partial }));
  };

  const t = (key: string, defaultEn?: string, defaultAm?: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][lang] || DICTIONARY[key]['en'];
    }
    return lang === 'am' ? (defaultAm || defaultEn || key) : (defaultEn || key);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        lang,
        setLang,
        colorMode,
        setColorMode,
        toggleColorMode,
        branding,
        setBranding,
        updateBranding,
        t,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}
