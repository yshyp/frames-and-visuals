import React, { useEffect, useState } from 'react';

interface CinematicLoadingProps {
  onComplete: () => void;
}

export const CinematicLoading: React.FC<CinematicLoadingProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'revealing' | 'fading' | 'done'>('revealing');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('fading');
    }, 1100);

    const timer2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] transition-opacity duration-700 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8E867A] font-sans">
          The Portfolio Experience
        </span>
        <h1 className="text-lg md:text-2xl font-serif tracking-[0.35em] uppercase text-[#F5F2EA] font-light">
          FRAMESANDVISUALSBYYSH
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mt-2 animate-pulse" />
      </div>
    </div>
  );
};
