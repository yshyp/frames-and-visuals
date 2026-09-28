import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Camera, MapPin, Info } from 'lucide-react';
import { Photo } from '../../types/portfolio';

interface PhotoLightboxProps {
  photo: Photo | null;
  allPhotos: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  allPhotos,
  onClose,
  onSelectPhoto,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  useEffect(() => {
    setIsZoomed(false);
  }, [photo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else {
      onSelectPhoto(allPhotos[allPhotos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else {
      onSelectPhoto(allPhotos[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in select-none">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8476] font-mono">
            {currentIndex + 1} / {allPhotos.length}
          </span>
          <span className="text-[#444]" aria-hidden="true">·</span>
          <span className="text-xs uppercase tracking-[0.2em] font-serif text-[#E8DCC4]">
            {photo.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            title="Toggle photo details"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrow Left */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 text-[#F5F2EA] rounded-full backdrop-blur-sm transition-all cursor-pointer hover:scale-110"
        title="Previous photograph (Left arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image Stage */}
      <div 
        className={`relative w-full h-full flex items-center justify-center p-6 md:p-12 overflow-auto ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={photo.image}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className={`max-w-full max-h-full object-contain transition-all duration-300 shadow-2xl ${
            isZoomed ? 'scale-150 md:scale-175' : 'scale-100'
          }`}
        />
      </div>

      {/* Navigation Arrow Right */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 text-[#F5F2EA] rounded-full backdrop-blur-sm transition-all cursor-pointer hover:scale-110"
        title="Next photograph (Right arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Photo Metadata Scrim */}
      {showDetails && (
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-serif tracking-[0.12em] uppercase text-[#F5F2EA] font-light">
                {photo.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#A8A8A8] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E2C799]" />
                <span>{photo.location}</span>
              </div>
              {photo.story && (
                <p className="text-xs text-[#8E867A] font-sans font-light mt-2 max-w-xl">
                  {photo.story}
                </p>
              )}
            </div>

            {/* EXIF technical specs */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A89F91] font-mono border-t md:border-t-0 border-[#222] pt-2 md:pt-0">
              {photo.camera && (
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#E2C799]" />
                  <span>{photo.camera}</span>
                </div>
              )}
              {photo.lens && <span>· {photo.lens}</span>}
              {photo.aperture && <span>· {photo.aperture}</span>}
              {photo.shutter && <span>· {photo.shutter}</span>}
              {photo.iso && <span>· {photo.iso}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
