import React, { useEffect, useState } from 'react';

export const FilmAtmosphere: React.FC = () => {
  const [timecode, setTimecode] = useState('00:01:24:12');

  // Real-time advancing SMPTE 24fps timecode counter for authentic film feel
  useEffect(() => {
    let frame = 12;
    let sec = 24;
    let min = 1;
    let hr = 0;

    const interval = setInterval(() => {
      frame += 1;
      if (frame >= 24) {
        frame = 0;
        sec += 1;
        if (sec >= 60) {
          sec = 0;
          min += 1;
          if (min >= 60) {
            min = 0;
            hr = (hr + 1) % 24;
          }
        }
      }
      setTimecode(
        `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${frame.toString().padStart(2, '0')}`
      );
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside aria-label="Cinematic Film Overlays" className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden">
      {/* 1. Organic 35mm Analog Film Grain Layer (simulated via 24fps SVG noise keyframe) */}
      <div
        className="absolute -inset-[30%] opacity-[0.055] mix-blend-screen pointer-events-none animate-film-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Floating Atmospheric Micro-Dust Motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: '15%', top: '25%', delay: '0s', duration: '14s', size: '2px' },
          { left: '45%', top: '65%', delay: '3s', duration: '18s', size: '3px' },
          { left: '75%', top: '35%', delay: '6s', duration: '16s', size: '2px' },
          { left: '85%', top: '80%', delay: '2s', duration: '20s', size: '3px' },
          { left: '30%', top: '85%', delay: '5s', duration: '15s', size: '2.5px' },
        ].map((mote, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E2C799]/40 blur-[0.5px] pointer-events-none"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              animation: `floatDust ${mote.duration} ease-in-out infinite`,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* 3. Subtle Film Corner Marks (35mm Motion Picture Safe Area) */}
      <div className="hidden lg:block absolute inset-6 sm:inset-10 border border-[#D4AF37]/10 pointer-events-none">
        {/* Top-left corner crosshair */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[#D4AF37]/40" />
        {/* Top-right corner crosshair */}
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-[#D4AF37]/40" />
        {/* Bottom-left corner crosshair */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[#D4AF37]/40" />
        {/* Bottom-right corner crosshair */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#D4AF37]/40" />

        {/* Quiet film camera metadata along the margins */}
        <div className="absolute top-2 left-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#A89F91]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-rec-pulse" />
          <span>REC 24FPS</span>
          <span>·</span>
          <span>KODAK 5219</span>
        </div>

        <div className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#A89F91]/40">
          <span>TC {timecode}</span>
        </div>
      </div>
    </aside>
  );
};
