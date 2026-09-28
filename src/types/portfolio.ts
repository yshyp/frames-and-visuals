export type Category = 'Wildlife' | 'Macro' | 'Nature' | 'Travel' | 'Visual Stories' | string;

export type PageLayoutType = 
  | 'cover'
  | 'inside-cover'
  | 'chapter-intro'
  | 'full-bleed'        // Layout A / G: Edge-to-edge cinematic single or double
  | 'centered-portrait'  // Layout D: Centered portrait with generous whitespace & fine typography
  | 'large-with-exif'    // Layout E: Large photograph with minimal title, location, camera, lens
  | 'split-duo'          // Layout C / F: Large photograph + supporting small photograph or complementary pair
  | 'editorial-quote'    // Supporting text/story page with minimalist layout
  | 'back-cover';

export interface Photo {
  id: string;
  title: string;
  category: Category;
  image: string; // URL, object URL, or high-res base64/SVG artwork
  location: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  story?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
}

export interface VideoStory {
  id: string;
  title: string;
  category: Category;
  description: string;
  duration: string;
  location: string;
  thumbnail: string;
  videoUrl?: string; // direct MP4 or WebM
  youtubeUrl?: string; // direct YouTube link
  youtubeId?: string; // embed ID
  gear?: string;
  featured?: boolean;
}

export interface Chapter {
  id: string;
  number: string;
  title: Category;
  subtitle: string;
  quote: string;
  description: string;
  coverImageId?: string;
}

export interface BookSpreadPage {
  pageNumber: number;
  layout: PageLayoutType;
  density: 'hard' | 'soft';
  chapter?: Chapter;
  primaryPhoto?: Photo;
  secondaryPhoto?: Photo;
  quote?: string;
  customText?: string;
  isLeft?: boolean;
}

export interface PhotographerProfile {
  name: string;
  brand: string;
  role: string;
  tagline: string;
  categories: string[];
  location: string;
  bio: string[];
  socials: {
    instagram: string;
    instagramUrl: string;
    youtube: string;
    youtubeUrl: string;
    facebook: string;
    facebookUrl: string;
    email: string;
  };
  portrait: string;
}
