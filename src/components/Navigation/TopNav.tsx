import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TopNavProps {
  currentView: 'hero' | 'album' | 'about' | 'contact' | 'admin';
  onNavigate: (view: 'hero' | 'album' | 'videos' | 'about' | 'contact') => void;
  onNavigateToAdmin?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-[#0B0B0B]/85 backdrop-blur-md border-b border-[#222222]/50 transition-all duration-300">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onNavigate('hero')}
        className="text-sm md:text-base font-serif tracking-[0.25em] uppercase text-[#F5F2EA] hover:text-[#E2C799] transition-colors cursor-pointer text-left"
      >
        FRAMES & VISUALS
      </button>

      {/* Zone 2: Clean text navigation links including Films */}
      <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-xs uppercase tracking-[0.2em] font-sans text-[#A8A8A8]">
        <button
          onClick={() => onNavigate('hero')}
          className={`hover:text-[#F5F2EA] transition-colors cursor-pointer pb-0.5 border-b ${
            currentView === 'hero' ? 'border-[#E2C799] text-[#F5F2EA]' : 'border-transparent'
          }`}
        >
          Introduction
        </button>
        <button
          onClick={() => onNavigate('album')}
          className={`hover:text-[#F5F2EA] transition-colors cursor-pointer pb-0.5 border-b ${
            currentView === 'album' ? 'border-[#E2C799] text-[#F5F2EA]' : 'border-transparent'
          }`}
        >
          The Album
        </button>
        <button
          onClick={() => onNavigate('videos')}
          className="hover:text-[#F5F2EA] transition-colors cursor-pointer pb-0.5 border-b border-transparent hover:border-[#E2C799]"
        >
          Reels & Shorts
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`hover:text-[#F5F2EA] transition-colors cursor-pointer pb-0.5 border-b ${
            currentView === 'about' ? 'border-[#E2C799] text-[#F5F2EA]' : 'border-transparent'
          }`}
        >
          Photographer
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className={`hover:text-[#F5F2EA] transition-colors cursor-pointer pb-0.5 border-b ${
            currentView === 'contact' ? 'border-[#E2C799] text-[#F5F2EA]' : 'border-transparent'
          }`}
        >
          Contact
        </button>
      </nav>

      {/* Zone 3: Audio & View actions only */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute paper audio' : 'Mute paper audio'}
          className="p-2 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
          aria-label={isMuted ? 'Unmute paper sounds' : 'Mute paper sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {currentView === 'album' ? (
          <button
            onClick={() => onNavigate('hero')}
            className="px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-[#0B0B0B] bg-[#E8DCC4] hover:bg-[#F5EFE3] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            ← Exit Album
          </button>
        ) : (
          <button
            onClick={() => onNavigate('album')}
            className="px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-[#0B0B0B] bg-[#E8DCC4] hover:bg-[#F5EFE3] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Open Album
          </button>
        )}
      </div>
    </header>
  );
};
