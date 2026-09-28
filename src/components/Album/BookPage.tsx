import React from 'react';
import { Maximize2, Camera, MapPin } from 'lucide-react';
import { BookSpreadPage, Photo } from '../../types/portfolio';

interface BookPageProps {
  page: BookSpreadPage;
  totalPages: number;
  onOpenPhoto: (photo: Photo) => void;
  onOpenPhotoManager?: () => void;
}

export const BookPage: React.FC<BookPageProps> = ({ page, totalPages, onOpenPhoto, onOpenPhotoManager }) => {
  const { layout, chapter, primaryPhoto, secondaryPhoto, quote, customText, pageNumber } = page;

  // Front Cover
  if (layout === 'cover') {
    return (
      <div 
        className="w-full h-full bg-[#131211] text-[#E8DCC4] flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85), inset 3px 0 6px rgba(255,255,255,0.05)',
          background: 'linear-gradient(135deg, #161513 0%, #0e0d0c 100%)'
        }}
      >
        {/* Leather/linen grain overlay */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(#3a3630 1px, transparent 1px)`,
            backgroundSize: '3px 3px'
          }}
        />

        {/* Spine hinge line */}
        <div className="absolute top-0 bottom-0 left-4 sm:left-6 w-[2px] bg-black/60 shadow-[0_0_3px_rgba(0,0,0,0.9)]" />

        <div className="relative z-10 flex flex-col items-center text-center pt-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A89F91]">
            Curated Monograph
          </span>
          <div className="w-8 h-[1px] bg-[#D4AF37]/40 mt-3" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center my-auto">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E2C799]" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-[0.22em] text-[#E8DCC4] uppercase font-light leading-tight">
            FRAMES & VISUALS
          </h1>
          <p className="text-xs sm:text-sm font-serif italic tracking-[0.3em] text-[#BDB29F] mt-2">
            BY YSH
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center pb-2 border-t border-[#262421]">
          <span className="text-xs font-serif tracking-[0.2em] uppercase text-[#F5F2EA] mt-4">
            VAISAKH Y P
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#6E685E] mt-1">
            Visual Storyteller · Kerala
          </span>
        </div>
      </div>
    );
  }

  // Inside Cover / Flyleaf
  if (layout === 'inside-cover') {
    return (
      <div 
        className="w-full h-full bg-[#171614] text-[#A8A297] flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)'
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#6E685E]">
          FramesandVisualsbyYsh
        </div>
        <div className="my-auto max-w-xs mx-auto text-center">
          <p className="font-serif italic text-sm sm:text-base text-[#D4CCC0] leading-relaxed">
            {customText || 'A visual testament to patience, wilderness, and light.'}
          </p>
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#666055] tracking-widest font-mono">
          <span>ARCHIVAL EDITION</span>
          <span>{pageNumber + 1} / {totalPages}</span>
        </div>
      </div>
    );
  }

  // Chapter Intro Spread Page
  if (layout === 'chapter-intro' && chapter) {
    return (
      <div 
        className="w-full h-full bg-[#141413] text-[#F5F2EA] flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none border-r border-[#22211e]"
        style={{
          boxShadow: 'inset -8px 0 20px rgba(0,0,0,0.4)'
        }}
      >
        {/* Top Chapter Category Marker */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8C8375] font-sans">
          <span>CHAPTER</span>
          <span className="text-[#C4B291] font-mono">{chapter.number}</span>
        </div>

        {/* Center Chapter Title & Poetic Epigraph */}
        <div className="my-auto max-w-sm">
          <span className="text-4xl sm:text-6xl font-serif text-[#C4B291]/30 font-light block leading-none mb-3">
            {chapter.number}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif tracking-[0.16em] uppercase text-[#F5F2EA] font-normal mb-4">
            {chapter.title}
          </h2>
          <div className="w-10 h-[1px] bg-[#C4B291]/50 mb-6" />
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#DCD4C7] leading-snug mb-4">
            “{chapter.quote}”
          </blockquote>
          <p className="text-xs sm:text-sm text-[#8C857B] font-sans font-light leading-relaxed">
            {chapter.description}
          </p>
        </div>

        {/* Page Footer */}
        <div className="flex justify-between items-center text-[10px] text-[#5E594F] font-mono tracking-widest">
          <span className="uppercase">{chapter.subtitle}</span>
          <span>{pageNumber + 1}</span>
        </div>
      </div>
    );
  }

  // Large Photograph with EXIF Details (Layout A / E)
  if (layout === 'large-with-exif' && primaryPhoto) {
    return (
      <div 
        className="w-full h-full bg-[#131312] text-[#F5F2EA] flex flex-col justify-between p-6 sm:p-8 relative select-none group"
        style={{
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)'
        }}
      >
        {/* Photo Container */}
        <div className="relative w-full flex-1 flex flex-col justify-center overflow-hidden bg-black/40 rounded-xs">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={primaryPhoto.image}
              alt={primaryPhoto.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Fullscreen Expansion Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPhoto(primaryPhoto);
              }}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-[#F5F2EA] rounded-full backdrop-blur-sm opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-lg hover:scale-110"
              title="Open high-resolution fullscreen photograph"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#E8DCC4]" />
            </button>
          </div>
        </div>

        {/* Minimal Editorial Photo Metadata (No pill enclosures) */}
        <div className="pt-4 border-t border-[#22211f] flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-serif tracking-[0.14em] uppercase text-[#F5F2EA] font-medium truncate">
              {primaryPhoto.title}
            </h3>
            <span className="text-[10px] text-[#6E685E] font-mono shrink-0">
              {pageNumber + 1}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-[#8E877B] font-sans">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#B8A37A]" />
              <span className="truncate max-w-[160px] sm:max-w-none">{primaryPhoto.location}</span>
            </span>
            {primaryPhoto.camera && (
              <>
                <span className="text-[#444]" aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#B8A37A]" />
                  <span>{primaryPhoto.camera}</span>
                </span>
              </>
            )}
            {primaryPhoto.lens && (
              <>
                <span className="text-[#444]" aria-hidden="true">·</span>
                <span>{primaryPhoto.lens}</span>
              </>
            )}
            {primaryPhoto.aperture && (
              <>
                <span className="text-[#444]" aria-hidden="true">·</span>
                <span className="font-mono text-[#A89F91]">{primaryPhoto.aperture}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Centered Portrait Photograph with Generous Archival Whitespace (Layout D)
  if (layout === 'centered-portrait' && primaryPhoto) {
    return (
      <div 
        className="w-full h-full bg-[#151514] text-[#F5F2EA] flex flex-col justify-between p-8 sm:p-12 relative select-none group"
        style={{
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)'
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.25em] text-[#6E675B] font-sans">
          {primaryPhoto.category}
        </div>

        {/* Centered Photographic Plate */}
        <div className="my-auto flex flex-col items-center">
          <div className="relative p-2 sm:p-3 bg-[#0d0d0c] shadow-[0_15px_35px_rgba(0,0,0,0.7)] border border-[#262421] max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
            <img
              src={primaryPhoto.image}
              alt={primaryPhoto.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[360px] sm:max-h-[440px]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPhoto(primaryPhoto);
              }}
              className="absolute top-4 right-4 p-1.5 bg-black/60 hover:bg-black/90 text-[#F5F2EA] rounded-full backdrop-blur-sm opacity-80 hover:opacity-100 transition-all cursor-pointer shadow-md hover:scale-110"
              title="Fullscreen"
            >
              <Maximize2 className="w-3 h-3 text-[#E8DCC4]" />
            </button>
          </div>

          <div className="text-center mt-5">
            <h4 className="text-xs sm:text-sm font-serif tracking-[0.16em] uppercase text-[#F5F2EA] font-normal">
              {primaryPhoto.title}
            </h4>
            <p className="text-[10px] font-sans text-[#8C8476] mt-1 tracking-wide">
              {primaryPhoto.location}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-[#5E594F] font-mono tracking-widest">
          <span>PLATE {pageNumber}</span>
          <span>{pageNumber + 1}</span>
        </div>
      </div>
    );
  }

  // Editorial Quote & Text Monograph Spread Page
  if (layout === 'editorial-quote') {
    return (
      <div 
        className="w-full h-full bg-[#161615] text-[#F5F2EA] flex flex-col justify-between p-8 sm:p-14 relative select-none"
        style={{
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)'
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#6E675B]">
          Visual Storytelling
        </div>

        <div className="my-auto max-w-sm mx-auto text-center">
          <div className="w-8 h-[1px] bg-[#D4AF37]/40 mx-auto mb-6" />
          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#E8DCC4] leading-relaxed mb-6 font-light">
            “{quote || 'I capture moments, details and stories through a frame.'}”
          </blockquote>
          {customText && (
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#8E877B] font-sans">
              {customText}
            </p>
          )}
          <div className="w-8 h-[1px] bg-[#D4AF37]/40 mx-auto mt-6" />
        </div>

        <div className="flex justify-between items-center text-[10px] text-[#5E594F] font-mono tracking-widest">
          <span>VAISAKH Y P</span>
          <span>{pageNumber + 1}</span>
        </div>
      </div>
    );
  }

  // Back Cover
  if (layout === 'back-cover') {
    return (
      <div 
        className="w-full h-full bg-[#131211] text-[#E8DCC4] flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
          background: 'linear-gradient(225deg, #161513 0%, #0e0d0c 100%)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(#3a3630 1px, transparent 1px)`,
            backgroundSize: '3px 3px'
          }}
        />

        <div className="text-right text-[9px] uppercase tracking-[0.3em] text-[#6E675B] relative z-10">
          END OF COLLECTION
        </div>

        <div className="my-auto text-center relative z-10">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E2C799]" />
          </div>
          <p className="font-serif tracking-[0.2em] uppercase text-sm sm:text-base text-[#D4CCC0]">
            FRAMESANDVISUALSBYYSH
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#736E66] mt-2">
            KERALA · INDIA
          </p>
          {onOpenPhotoManager && (
            <button
              onClick={onOpenPhotoManager}
              className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E2C799]/10 hover:bg-[#E2C799] text-[#E2C799] hover:text-[#0B0B0B] border border-[#E2C799]/40 text-[9px] uppercase tracking-[0.2em] rounded-xs transition-colors cursor-pointer"
            >
              + Add Photos to Album
            </button>
          )}
        </div>

        <div className="flex justify-between items-center text-[9px] text-[#524E47] font-mono tracking-widest relative z-10 border-t border-[#22211e] pt-3">
          <span>MONOGRAPH EDITION</span>
          <span>FIN</span>
        </div>
      </div>
    );
  }

  // Fallback Page
  return (
    <div className="w-full h-full bg-[#141414] text-[#F5F2EA] p-8 flex items-center justify-center">
      <span className="text-xs font-mono text-[#666]">{pageNumber + 1}</span>
    </div>
  );
};
