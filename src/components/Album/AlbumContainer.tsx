import React, { useState } from 'react';
import { BookSpreadPage, Photo } from '../../types/portfolio';
import { ClosedAlbum } from './ClosedAlbum';
import { RealisticBook } from './RealisticBook';
import { soundManager } from '../../utils/sound';

interface AlbumContainerProps {
  pages: BookSpreadPage[];
  onExit: () => void;
  onOpenPhoto: (photo: Photo) => void;
  onOpenPhotoManager: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const AlbumContainer: React.FC<AlbumContainerProps> = ({
  pages,
  onExit,
  onOpenPhoto,
  onOpenPhotoManager,
  isMuted,
  onToggleMute,
}) => {
  const [albumState, setAlbumState] = useState<'closed' | 'opening' | 'open'>('closed');

  const handleStartOpening = () => {
    setAlbumState('opening');
    soundManager.playCoverMovement('open');

    // Smooth cinematic sequence: 900ms cover swing open -> transition to interactive PageFlip
    setTimeout(() => {
      setAlbumState('open');
    }, 950);
  };

  const handleCloseAlbum = () => {
    soundManager.playCoverMovement('close');
    setAlbumState('closed');
  };

  if (albumState === 'open') {
    return (
      <RealisticBook
        pages={pages}
        onExit={handleCloseAlbum}
        onOpenPhoto={onOpenPhoto}
        onOpenPhotoManager={onOpenPhotoManager}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic Opening Animation Transition */}
      {albumState === 'opening' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0B0B0B] transition-all duration-700 animate-fade-in perspective-[1500px]">
          <div className="relative w-[340px] sm:w-[440px] h-[480px] sm:h-[580px] transform-style-3d animate-open-book-spread">
            {/* Opening Left Cover Half */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-[#131211] border border-[#2b2926] shadow-2xl origin-left"
              style={{
                transform: 'rotateY(-140deg)',
                transition: 'transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            />
            {/* First Spread Glimpse */}
            <div className="absolute inset-0 bg-[#161514] border border-[#222] shadow-inner flex items-center justify-center p-8 text-center">
              <span className="font-serif italic text-lg text-[#E8DCC4] tracking-widest animate-pulse">
                Opening monograph...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Closed 3D Physical Album */}
      <ClosedAlbum onOpen={handleStartOpening} />
    </div>
  );
};
