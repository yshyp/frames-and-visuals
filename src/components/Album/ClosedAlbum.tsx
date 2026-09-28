import React, { useState, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface ClosedAlbumProps {
  onOpen: () => void;
}

export const ClosedAlbum: React.FC<ClosedAlbumProps> = ({ onOpen }) => {
  const [rotate, setRotate] = useState({ x: 12, y: -18 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10 + 10;
    const rotY = ((x - centerX) / centerX) * 14 - 15;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 12, y: -18 });
  };

  const handleOpenClick = () => {
    soundManager.playCoverMovement('open');
    onOpen();
  };

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 perspective-[1400px]">
      {/* Soft Ambient Light Glow on the Table Surface */}
      <div className="absolute w-[500px] sm:w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_rgba(11,11,11,0)_70%)] pointer-events-none -translate-y-8" />

      {/* Realistic Table Surface Reflection / Shadow */}
      <div 
        className="absolute bottom-16 w-[360px] sm:w-[480px] h-[40px] bg-black/80 rounded-full blur-2xl transform scale-y-50 pointer-events-none transition-transform duration-300"
        style={{
          transform: `scaleY(0.4) rotate(${rotate.y * 0.4}deg) translateY(${isHovered ? 20 : 0}px)`,
          opacity: isHovered ? 0.9 : 0.7
        }}
      />

      {/* 3D Physical Book Object */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenClick}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(-1.5deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="group relative w-[300px] sm:w-[380px] md:w-[440px] h-[420px] sm:h-[520px] md:h-[580px] cursor-pointer select-none"
        title="Click to open the photography album"
      >
        {/* Book Spine (3D Left Edge) */}
        <div 
          className="absolute top-0 left-0 w-[36px] sm:w-[44px] h-full bg-[#121110] border-r border-[#262421] origin-left"
          style={{
            transform: 'rotateY(-90deg) translateX(-36px)',
            background: 'linear-gradient(90deg, #0a0908 0%, #1c1a17 50%, #100f0d 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
          }}
        >
          <div className="h-full flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
            <span className="text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#C2B294]/70">
              FRAMES & VISUALS · BY YSH
            </span>
          </div>
        </div>

        {/* Visible Inner Page Paper Block (Bottom & Right Realistic Edges) */}
        {/* Right Paper Edges */}
        <div 
          className="absolute top-2 right-[-24px] sm:right-[-30px] w-[26px] sm:w-[32px] h-[calc(100%-16px)] origin-left"
          style={{
            transform: 'rotateY(90deg)',
            background: 'repeating-linear-gradient(to right, #e2ded4 0px, #d5d0c3 1px, #ede9df 2px, #c7c2b3 3px)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)'
          }}
        />

        {/* Bottom Paper Edges */}
        <div 
          className="absolute bottom-[-22px] left-3 w-[calc(100%-16px)] h-[24px] origin-top"
          style={{
            transform: 'rotateX(-90deg)',
            background: 'repeating-linear-gradient(to bottom, #ded9ce 0px, #cac4b5 1px, #ebe6db 2px, #bbb5a4 3px)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)'
          }}
        />

        {/* Book Hardcover Front Face */}
        <div className="relative w-full h-full rounded-sm bg-[#131313] border border-[#2b2926] shadow-[0_30px_70px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between p-8 sm:p-12 md:p-14">
          {/* Rich Fine-Grain Cloth/Leather Cover Texture */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#2a2825 1px, transparent 1px)`,
              backgroundSize: '4px 4px'
            }}
          />

          {/* Hardcover Spine Hinge Indentation Line */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-8 w-[2px] bg-gradient-to-r from-black/80 via-white/5 to-black/90 shadow-[0_0_4px_rgba(0,0,0,0.9)]" />

          {/* Cover Top Vignette & Subtle Gold Line */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.35em] uppercase text-[#A89F91] mb-2 font-medium">
              A PHOTOGRAPHIC MONOGRAPH
            </span>
            <div className="w-12 h-[1px] bg-[#D4AF37]/40 mb-8" />
          </div>

          {/* Center Embossed Gold Foil Title */}
          <div className="relative z-10 flex flex-col items-center text-center my-auto">
            {/* Minimalist Camera Aperture Monogram */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-8 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] group-hover:border-[#E8DCC4] transition-colors">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#E2C799]" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-[0.22em] text-[#E8DCC4] uppercase font-light leading-tight mb-3">
              FRAMES & VISUALS
            </h2>
            <p className="text-sm sm:text-base font-serif italic tracking-[0.3em] text-[#BDB29F] uppercase">
              BY YSH
            </p>
          </div>

          {/* Cover Bottom: Photographer Name & Curated Edition */}
          <div className="relative z-10 flex flex-col items-center text-center pt-8 border-t border-[#262421]/80">
            <span className="text-xs sm:text-sm font-serif tracking-[0.2em] uppercase text-[#F5F2EA] font-medium">
              VAISAKH Y P
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.25em] uppercase text-[#736E66] mt-1">
              FIRST EDITION · HARDCOVER
            </span>
          </div>

          {/* Subtle Light Glint on Foil Hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
          />
        </div>
      </div>

      {/* Elegant Action Prompt */}
      <div className="mt-12 flex flex-col items-center gap-2 text-center animate-fade-in">
        <button
          onClick={handleOpenClick}
          className="group inline-flex items-center gap-2.5 px-6 py-2.5 text-xs font-sans uppercase tracking-[0.25em] text-[#F5F2EA] bg-[#161616] hover:bg-[#202020] border border-[#333333] hover:border-[#E2C799]/60 transition-all rounded-sm cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(226,199,153,0.15)]"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#E2C799] group-hover:scale-110 transition-transform" />
          <span>Click Album to Open</span>
        </button>
        <span className="text-[11px] text-[#787878] font-sans tracking-wide">
          Realistic two-page interactive spreads with tactile page curl
        </span>
      </div>
    </div>
  );
};
