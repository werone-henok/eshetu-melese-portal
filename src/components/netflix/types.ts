// Netflix UI Shared Types & Converters for Eshetu Melese Portal
import { ShowItem } from '@/data/showsData';
import { MediaGalleryItem } from '@/data/mediaGalleryData';

export interface NetflixMediaItem {
  id: string;
  uniqueId: string;
  title: string;
  titleAm?: string;
  author?: string;
  thumbnailUrl: string;
  highResUrl?: string;
  embedUrl?: string;
  url?: string;
  type: 'video' | 'image';
  categorySlug: string;
  categoryLabel: string;
  categoryLabelAm: string;
  badge?: string;
  badgeColor?: string;
  isTop10?: boolean;
  matchScore: number; // e.g. 98 -> "98% Match"
  ratingBadge: string; // e.g. "U/A 13+", "16+", "All Ages"
  duration: string; // e.g. "45m", "1h 20m", "4K Ultra HD"
  genres: string[]; // e.g. ["Adventure", "Comedy"]
  genresAm: string[];
  description?: string;
  descriptionAm?: string;
  date?: string;
  location?: string;
}

export interface NetflixRowConfig {
  id: string;
  titleEn: string;
  titleAm: string;
  subtitleEn?: string;
  subtitleAm?: string;
  items: NetflixMediaItem[];
}

const GENRE_MAP: Record<string, { en: string[]; am: string[]; rating: string; duration: string }> = {
  'amazing-kids': {
    en: ['Kids & Family', 'Inspirational', 'Talent Show'],
    am: ['ድንቅ ልጆች', 'ቤተሰብ', 'የተሰጥኦ መድረክ'],
    rating: 'All Ages',
    duration: '45m',
  },
  'gash-eshetu': {
    en: ['Talk Show', 'Culture & Society', 'Humor'],
    am: ['ጋሽ እሸቱ', 'ቶክ ሾው', 'ባህልና ወግ'],
    rating: '13+',
    duration: '1h 15m',
  },
  'corporate-storytelling': {
    en: ['Brand Storytelling', 'Innovation', 'High ROI'],
    am: ['የኮርፖሬት ታሪኮች', 'ፈጠራ', 'ብራንድ'],
    rating: 'All Ages',
    duration: '25m',
  },
  'standup-comedy': {
    en: ['Stand Up Comedy', 'Live Special', 'Satire'],
    am: ['ስታንዳፕ ኮሜዲ', 'የቀጥታ ስራ', 'አስቂኝ'],
    rating: '16+',
    duration: '1h 40m',
  },
  'reality-shows': {
    en: ['Reality Show', 'Drama & Fun', 'Adventure'],
    am: ['ሪያሊቲ ሾው', 'ውድድር', 'አስደሳች'],
    rating: '13+',
    duration: '50m',
  },
  'best-stories': {
    en: ['Life Stories', 'Emotional', 'Human Interest'],
    am: ['የህይወት ታሪክ', 'ልብ የሚነካ', 'አስተማሪ'],
    rating: '13+',
    duration: '40m',
  },
  'best-productions': {
    en: ['Cinematic Production', 'Blockbuster', 'Masterpiece'],
    am: ['ሲኒማቶግራፊ', 'ምርጥ ዝግጅት', 'ፕሮዳክሽን'],
    rating: '13+',
    duration: '35m',
  },
  'live-fundraising': {
    en: ['Humanitarian', 'Community Hope', 'Generosity'],
    am: ['በጎ አድራጎት', 'ህብረተሰብ', 'ተስፋና ድጋፍ'],
    rating: 'All Ages',
    duration: '1h 30m',
  },
  'international-documentaries': {
    en: ['Global Culture', 'Documentary', 'Discovery'],
    am: ['አለም አቀፍ', 'ዶክመንተሪ', 'ባህል'],
    rating: '13+',
    duration: '1h 10m',
  },
  'documentaries': {
    en: ['Documentary Feature', 'Heritage', 'History'],
    am: ['ዶክመንተሪ', 'ታሪክና ቅርስ', 'እውነት'],
    rating: '13+',
    duration: '55m',
  },
};

export function convertShowToNetflixItem(show: ShowItem, index = 0): NetflixMediaItem {
  const meta = GENRE_MAP[show.categorySlug] || {
    en: [show.categoryLabel, 'Entertainment', 'Show'],
    am: [show.categoryLabelAm, 'መዝናኛ', 'ዝግጅት'],
    rating: '13+',
    duration: '45m',
  };

  // Top 10 flag: assign to top items of each category
  const isTop10 = index < 3 || show.badge.includes('TOP 10');
  const matchScore = 95 + (Math.abs((show.title.length * 7 + index * 3) % 5)); // 95 - 99% match

  return {
    id: show.id,
    uniqueId: show.uniqueId,
    title: show.title,
    titleAm: show.title,
    author: show.author || 'Comedian Eshetu Melese',
    thumbnailUrl: show.thumbnailUrl,
    highResUrl: show.maxResThumbnailUrl,
    embedUrl: show.embedUrl,
    url: show.url,
    type: 'video',
    categorySlug: show.categorySlug,
    categoryLabel: show.categoryLabel,
    categoryLabelAm: show.categoryLabelAm,
    badge: show.badge,
    badgeColor: show.badgeColor,
    isTop10,
    matchScore,
    ratingBadge: meta.rating,
    duration: meta.duration,
    genres: meta.en,
    genresAm: meta.am,
    description: `Official feature video from Comedian Eshetu Melese in ${show.categoryLabel}. High definition YouTube production with millions of views worldwide.`,
    descriptionAm: `በኮሜዲያን እሸቱ መለሰ የተዘጋጀ ይፋዊ የ${show.categoryLabelAm} ዝግጅት። በሚሊዮኖች የሚወደድ ከፍተኛ ጥራት ያለው ቪዲዮ።`,
  };
}

export function convertGalleryToNetflixItem(item: MediaGalleryItem, index = 0): NetflixMediaItem {
  const isBts = item.category === 'bts';
  const isTop10 = index < 3 || item.featured === true;
  const matchScore = 96 + (index % 4);

  return {
    id: item.id,
    uniqueId: `gallery-${item.id}`,
    title: item.title,
    titleAm: item.titleAm,
    author: 'Comedian Eshetu Melese Vault',
    thumbnailUrl: item.thumbnailUrl,
    highResUrl: item.highResUrl,
    embedUrl: item.embedUrl,
    url: item.driveLink,
    type: item.type,
    categorySlug: item.category,
    categoryLabel: item.categoryLabel,
    categoryLabelAm: item.categoryLabelAm,
    badge: item.badge,
    badgeColor: item.badgeColor,
    isTop10,
    matchScore,
    ratingBadge: isBts ? 'Behind The Scenes' : 'Live Stage',
    duration: item.type === 'video' ? 'HD Reel' : 'Photo 4K',
    genres: isBts
      ? ['Behind The Scenes', 'Dubai Studio Set', 'Cinema Rig']
      : ['Stand Up Comedy', 'Live Concert Stills', 'Arena Tour'],
    genresAm: isBts
      ? ['ከመጋረጃው ጀርባ', 'የዱባይ ቀረጻ', 'ሲኒማቶግራፊ']
      : ['ስታንዳፕ ኮሜዲ', 'የመድረክ ፎቶዎች', 'አለም አቀፍ ጉብኝት'],
    description: item.description,
    descriptionAm: item.descriptionAm,
    date: item.date,
    location: item.location,
  };
}
