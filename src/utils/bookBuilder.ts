import { Photo, BookSpreadPage } from '../types/portfolio';
import { CHAPTERS } from '../data/chapters';

export function buildBookPages(photos: Photo[]): BookSpreadPage[] {
  const pages: BookSpreadPage[] = [];

  // Group photos by category
  const photosByCategory: Record<string, Photo[]> = {
    Wildlife: photos.filter(p => p.category === 'Wildlife'),
    Macro: photos.filter(p => p.category === 'Macro'),
    Nature: photos.filter(p => p.category === 'Nature'),
    Travel: photos.filter(p => p.category === 'Travel'),
    'Visual Stories': photos.filter(p => p.category === 'Visual Stories'),
  };

  // Helper to get fallback photo or first available
  const getPhoto = (cat: string, index: number): Photo | undefined => {
    const list = photosByCategory[cat] || [];
    return list[index] || photos[index % photos.length];
  };

  let pageIndex = 0;

  // PAGE 0: Front Hardcover
  pages.push({
    pageNumber: pageIndex++,
    layout: 'cover',
    density: 'hard'
  });

  // PAGE 1: Inside Front Cover / Flyleaf (Left side of first spread)
  pages.push({
    pageNumber: pageIndex++,
    layout: 'inside-cover',
    density: 'soft',
    customText: 'A visual documentation of light, stillness, and fleeting existence across southern landscapes.'
  });

  // PAGE 2: Frontispiece / Title Page (Right side of first spread)
  pages.push({
    pageNumber: pageIndex++,
    layout: 'editorial-quote',
    density: 'soft',
    quote: 'To see what is always there, but seldom witnessed.',
    customText: 'FRAMES & VISUALS BY YSH · VAISAKH Y P'
  });

  // Get all existing categories in photos
  const existingCategoryTitles = new Set(CHAPTERS.map(c => c.title as string));
  const dynamicChapters: typeof CHAPTERS = [...CHAPTERS];

  // Discover any custom user-added albums/categories
  const customCategories = Array.from(new Set(photos.map(p => p.category))).filter(
    cat => !existingCategoryTitles.has(cat)
  );

  customCategories.forEach((catName, idx) => {
    const num = String(CHAPTERS.length + idx + 1).padStart(2, '0');
    dynamicChapters.push({
      id: catName.toLowerCase().replace(/\s+/g, '-'),
      number: num,
      title: catName,
      subtitle: catName.toUpperCase(),
      quote: `Moments from the ${catName} collection.`,
      description: `Curated photographic plates from the ${catName} portfolio.`
    });
  });

  // CHAPTERS SPREADS
  dynamicChapters.forEach((chapter) => {
    const catPhotos = photos.filter(p => p.category === chapter.title);
    if (catPhotos.length === 0) return;
    const p1 = catPhotos[0];

    // Spread 1 for this chapter:
    // Left: Chapter Intro Page
    pages.push({
      pageNumber: pageIndex++,
      layout: 'chapter-intro',
      density: 'soft',
      chapter,
      quote: chapter.quote,
      isLeft: true
    });

    // Right: Primary Hero Photograph (Layout A / G Full-bleed or with minimal EXIF)
    pages.push({
      pageNumber: pageIndex++,
      layout: p1?.aspectRatio === 'landscape' ? 'large-with-exif' : 'centered-portrait',
      density: 'soft',
      chapter,
      primaryPhoto: p1,
      isLeft: false
    });

    // Subsequent Spreads for this chapter (all remaining photos in this category)
    for (let idx = 1; idx < catPhotos.length; idx += 2) {
      const leftPhoto = catPhotos[idx];
      const rightPhoto = catPhotos[idx + 1];

      // Left page of spread
      pages.push({
        pageNumber: pageIndex++,
        layout: leftPhoto.aspectRatio === 'landscape' ? 'large-with-exif' : 'centered-portrait',
        density: 'soft',
        chapter,
        primaryPhoto: leftPhoto,
        isLeft: true
      });

      // Right page of spread
      if (rightPhoto) {
        pages.push({
          pageNumber: pageIndex++,
          layout: rightPhoto.aspectRatio === 'landscape' ? 'large-with-exif' : 'centered-portrait',
          density: 'soft',
          chapter,
          primaryPhoto: rightPhoto,
          isLeft: false
        });
      } else {
        // Balanced editorial spread plate if odd count of photos
        pages.push({
          pageNumber: pageIndex++,
          layout: 'editorial-quote',
          density: 'soft',
          chapter,
          quote: leftPhoto.story || chapter.quote,
          customText: `${leftPhoto.title} · ${leftPhoto.location}`,
          isLeft: false
        });
      }
    }
  });

  // Additional user photos that haven't been displayed yet
  const displayedIds = new Set<string>();
  pages.forEach(p => {
    if (p.primaryPhoto) displayedIds.add(p.primaryPhoto.id);
    if (p.secondaryPhoto) displayedIds.add(p.secondaryPhoto.id);
  });
  const unplaced = photos.filter(p => !displayedIds.has(p.id));

  for (let i = 0; i < unplaced.length; i += 2) {
    const u1 = unplaced[i];
    const u2 = unplaced[i + 1];

    pages.push({
      pageNumber: pageIndex++,
      layout: u1.aspectRatio === 'portrait' ? 'centered-portrait' : 'large-with-exif',
      density: 'soft',
      primaryPhoto: u1,
      isLeft: true
    });

    if (u2) {
      pages.push({
        pageNumber: pageIndex++,
        layout: u2.aspectRatio === 'portrait' ? 'centered-portrait' : 'large-with-exif',
        density: 'soft',
        primaryPhoto: u2,
        isLeft: false
      });
    } else {
      // Balance spread with quiet editorial page
      pages.push({
        pageNumber: pageIndex++,
        layout: 'editorial-quote',
        density: 'soft',
        quote: 'Every frame holds a quiet truth.',
        isLeft: false
      });
    }
  }

  // Pre-Back Spread: Left is Colophon, Right is Inside Back Cover
  // Ensure we have an odd number of soft pages so adding 1 back cover makes total EVEN.
  // Currently: Front cover is page 0 (1 page).
  // Total pages needed: EVEN number.
  // So pages before back cover must be ODD in length.
  if (pages.length % 2 === 0) {
    // We need 1 more soft page to make count before back cover odd
    pages.push({
      pageNumber: pageIndex++,
      layout: 'editorial-quote',
      density: 'soft',
      quote: 'Photography is the pause button of life.',
      customText: 'FramesandVisualsbyYsh · Kerala, India',
      isLeft: true
    });
  }

  // Back Flyleaf (Left side of final spread)
  pages.push({
    pageNumber: pageIndex++,
    layout: 'inside-cover',
    density: 'soft',
    customText: 'Printed digitally in high-gamut monochrome and warm tones.'
  });

  // Back Hardcover (Single back page, hard density)
  pages.push({
    pageNumber: pageIndex++,
    layout: 'back-cover',
    density: 'hard'
  });

  return pages;
}
