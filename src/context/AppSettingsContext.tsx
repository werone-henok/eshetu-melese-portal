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
  // Navigation (Single-Word Concise Labels)
  'nav.home': { en: 'Home', am: 'ዋና' },
  'nav.about': { en: 'About', am: 'ስለ' },
  'nav.charity': { en: 'Charity', am: 'ለመጽደቅ' },
  'nav.events': { en: 'Events', am: 'ዝግጅቶች' },
  'nav.benefits': { en: 'Benefits', am: 'ጥቅሞች' },
  'nav.tiers': { en: 'Tiers', am: 'ደረጃዎች' },
  'nav.media': { en: 'Media', am: 'ሚዲያ' },
  'nav.gallery': { en: 'Members', am: 'አባላት' },
  'nav.profile': { en: 'Profile', am: 'መገለጫ' },
  'nav.howItWorks': { en: 'Steps', am: 'አሰራር' },
  'nav.faq': { en: 'FAQ', am: 'ጥያቄዎች' },
  'nav.more': { en: 'More', am: 'ተጨማሪ' },
  'nav.verify': { en: 'Verify', am: 'አረጋግጥ' },
  'nav.joinNow': { en: 'Join', am: 'አባል' },
  'nav.contact': { en: 'Contact', am: 'ያግኙን' },
  'nav.talk': { en: 'Talk', am: 'እንነጋገር' },
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

    // Load cached branding immediately from localStorage for zero-latency load
    try {
      const cachedBrand = localStorage.getItem('eshetu_branding');
      if (cachedBrand) {
        setBrandingState(JSON.parse(cachedBrand));
      }
    } catch {}

    // Load site branding from API in background and sync
    async function loadBranding() {
      try {
        const res = await fetch('/api/cms/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.branding) {
            setBrandingState(data.branding);
            try {
              localStorage.setItem('eshetu_branding', JSON.stringify(data.branding));
            } catch {}
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
