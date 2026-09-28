import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Play,
  Pause,
  Film,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Photo } from '../types/portfolio';
import { PHOTOGRAPHER_INFO } from '../data/photos';

interface IntroHeroProps {
  heroPhoto?: Photo;
  onEnterPortfolio: () => void;
  onScrollToAbout: () => void;
  onScrollToChapters: () => void;
}

export const IntroHero: React.FC<IntroHeroProps> = ({
  heroPhoto,
  onEnterPortfolio,
  onScrollToAbout,
  onScrollToChapters,
}) => {
  const bgImage = heroPhoto?.image || '/images/photographer-vaisakh.jpg';
  const videoSrc = '/uploads/videos/Video_by_frames_by_ysh__DIeN4xZImgV_-1790488435024-7842.mp4';

  const [bgMode, setBgMode] = useState<'film' | 'photo'>('film');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#070707]">
      {/* 1. Cinematic Background Layer: Motion Video or High-Res Curated Plate */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Moving Background Video */}
        {bgMode === 'film' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={videoSrc}
              poster="/uploads/videos/kappil-reel-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105 transform animate-cinematic-pan filter brightness-[0.75] contrast-110"
            />
          </div>
        ) : (
          /* Still Photography Background with Slow Ken Burns Drift */
          <img
            src={bgImage}
            alt={heroPhoto?.title || 'Vaisakh Y P Photography'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transform animate-cinematic-pan filter brightness-[0.75] contrast-105"
          />
        )}

        {/* 2. Anamorphic Warm Golden Light Flare Drift */}
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[600px] bg-gradient-to-br from-[#D4AF37]/20 via-[#B38728]/10 to-transparent rounded-full blur-[130px] animate-anamorphic-drift pointer-events-none" />

        {/* 3. Deep Cinematic Dark Scrim & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-[#070707]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070707]/50 to-[#070707]" />

        {/* 4. Widescreen 2.39:1 Cinema Letterbox Edge Lines */}
        <div className="absolute top-0 inset-x-0 h-10 sm:h-14 bg-gradient-to-b from-[#070707] to-transparent pointer-events-none border-b border-[#D4AF37]/15" />
        <div className="absolute bottom-0 inset-x-0 h-14 sm:h-20 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none border-t border-[#D4AF37]/15" />
      </div>

      {/* 2. Cinematic Camera HUD Overlays */}
      <div className="hidden md:flex absolute top-24 left-8 right-8 z-10 items-center justify-between pointer-events-none text-[10px] font-mono uppercase tracking-[0.25em] text-[#A89F91]/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-rec-pulse" />
          <span>CINEMA RECORDING</span>
          <span>·</span>
          <span>4K N-LOG</span>
        </div>
        <div className="flex items-center gap-3">
          <span>KERALA, INDIA</span>
          <span>·</span>
          <span>35MM PRIME</span>
        </div>
      </div>

      {/* 3. Main Hero Typography & Monograph Entrance */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center flex flex-col items-center">
        {/* Brand Kicker */}
        <div className="flex items-center gap-3 mb-6 opacity-90 animate-fade-in">
          <span className="w-6 h-[1px] bg-[#E2C799]/60" />
          <span className="text-xs md:text-sm font-sans tracking-[0.35em] uppercase text-[#E2C799] font-medium">
            {PHOTOGRAPHER_INFO.brand}
          </span>
          <span className="w-6 h-[1px] bg-[#E2C799]/60" />
        </div>

        {/* Photographer Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-[0.14em] text-[#F5F2EA] uppercase font-light leading-none mb-4 text-balance drop-shadow-2xl">
          {PHOTOGRAPHER_INFO.name}
        </h1>

        {/* Role & Craft */}
        <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#D8CEBF] tracking-wide mb-6">
          {PHOTOGRAPHER_INFO.role}
        </p>

        {/* Supporting Quote */}
        <blockquote className="max-w-xl text-sm sm:text-base text-[#AEA699] font-sans font-light leading-relaxed mb-8">
          “{PHOTOGRAPHER_INFO.tagline}”
        </blockquote>

        {/* Natural Disciplines (Unboxed inline text with typographic dot separators) */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm uppercase tracking-[0.25em] text-[#A8A8A8] font-sans mb-12">
          <span>Wildlife</span>
          <span className="text-[#666]" aria-hidden="true">·</span>
          <span>Macro</span>
          <span className="text-[#666]" aria-hidden="true">·</span>
          <span>Nature</span>
          <span className="text-[#666]" aria-hidden="true">·</span>
          <span>Travel</span>
          <span className="text-[#666]" aria-hidden="true">·</span>
          <span>9:16 Visual Reels</span>
        </div>

        {/* Primary Call to Action: ENTER PORTFOLIO */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <button
            onClick={onEnterPortfolio}
            className="group relative inline-flex items-center gap-3 px-9 py-4 text-xs sm:text-sm uppercase tracking-[0.28em] font-sans font-medium text-[#F5F2EA] bg-transparent border border-[#C5B492]/60 hover:border-[#F5F2EA] rounded-none overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] cursor-pointer"
          >
            <span className="absolute inset-0 bg-[#E8DCC4] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
            <BookOpen className="w-4 h-4 text-[#E2C799] group-hover:text-[#0B0B0B] transition-colors relative z-10" />
            <span className="relative z-10 group-hover:text-[#0B0B0B] transition-colors font-medium">
              ENTER PORTFOLIO
            </span>
            <ArrowRight className="w-4 h-4 text-[#E2C799] group-hover:text-[#0B0B0B] transition-transform duration-400 group-hover:translate-x-1.5 relative z-10" />
          </button>
        </div>

        {/* Minimal Scroll Down Affordance */}
        <div className="mt-16 flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-[#8C8476]">
          <button
            onClick={onScrollToChapters}
            className="hover:text-[#F5F2EA] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Collections</span>
          </button>
          <span className="text-[#555]">·</span>
          <button
            onClick={onScrollToAbout}
            className="hover:text-[#F5F2EA] transition-colors cursor-pointer"
          >
            Behind the Lens
          </button>
        </div>
      </div>

      {/* 4. Cinematic Floating Controller in Corner (Motion Film vs Still Plate) */}
      <div className="absolute bottom-6 right-6 md:right-10 z-20 flex items-center gap-2 bg-[#121110]/85 backdrop-blur-md border border-[#2B2925] p-1.5 text-[10px] font-mono uppercase tracking-wider text-[#A89F91]">
        <button
          type="button"
          onClick={() => setBgMode('film')}
          className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer ${
            bgMode === 'film'
              ? 'bg-[#E2C799] text-[#070707] font-medium'
              : 'hover:text-[#F5F2EA]'
          }`}
          title="Switch to Moving Film Background"
        >
          <Film className="w-3 h-3" />
          <span>Moving Film</span>
        </button>

        <button
          type="button"
          onClick={() => setBgMode('photo')}
          className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer ${
            bgMode === 'photo'
              ? 'bg-[#E2C799] text-[#070707] font-medium'
              : 'hover:text-[#F5F2EA]'
          }`}
          title="Switch to Still Photography Plate"
        >
          <ImageIcon className="w-3 h-3" />
          <span>Still Plate</span>
        </button>

        {bgMode === 'film' && (
          <button
            type="button"
            onClick={toggleVideoPlayback}
            className="p-1 hover:text-[#E2C799] transition-colors cursor-pointer border-l border-[#33302A] pl-2"
            title={isVideoPlaying ? 'Pause Background Video' : 'Play Background Video'}
          >
            {isVideoPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
          </button>
        )}
      </div>

      {/* Hero Edge Fade into dark canvas */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none" />
    </section>
  );
};
