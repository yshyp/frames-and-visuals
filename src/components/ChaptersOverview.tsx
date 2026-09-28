import React from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { Photo } from '../types/portfolio';

interface ChaptersOverviewProps {
  photos: Photo[];
  onSelectChapter: (chapterId: string) => void;
}

export const ChaptersOverview: React.FC<ChaptersOverviewProps> = ({
  photos,
  onSelectChapter,
}) => {
  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#0A0A0A] text-[#F5F2EA] border-t border-[#1C1B19]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#A89F91] mb-2 font-sans">
              <Compass className="w-3.5 h-3.5 text-[#E2C799]" />
              <span>Monograph Chapters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.14em] uppercase text-[#F5F2EA] font-light">
              THE COLLECTIONS
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[#8E867A] font-sans font-light leading-relaxed">
            Curated visual journeys organized across five natural disciplines. Discover them as sequential two-page spreads in the physical album.
          </p>
        </div>

        {/* Chapters Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter) => {
            const chapterPhotos = photos.filter(p => p.category === chapter.title);
            const featuredPhoto = chapterPhotos[0] || photos[0];

            return (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className="group relative bg-[#121211] border border-[#24221f] hover:border-[#E2C799]/40 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between p-6 shadow-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              >
                {/* Image Plate with Film Framing */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60 mb-6 rounded-xs">
                  <img
                    src={featuredPhoto?.image}
                    alt={chapter.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
                  
                  {/* Film Plate Top Badge */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]/75">
                    <span>35MM FILM ROLL</span>
                    <span>EXP 0{chapter.number}</span>
                  </div>

                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#E8DCC4] uppercase tracking-widest">
                    {chapterPhotos.length} {chapterPhotos.length === 1 ? 'Plate' : 'Plates'}
                  </span>
                </div>

                {/* Chapter Meta */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif text-[#C4B291] tracking-widest">
                      CHAPTER {chapter.number}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#777] group-hover:text-[#E2C799] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h3 className="text-xl font-serif tracking-[0.12em] uppercase text-[#F5F2EA] mb-2">
                    {chapter.title}
                  </h3>

                  <blockquote className="font-serif italic text-xs text-[#C4BDB0] mb-3">
                    “{chapter.quote}”
                  </blockquote>

                  <p className="text-[11px] text-[#7A746B] font-sans font-light leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1C1A18] flex items-center justify-between text-[10px] text-[#A89F91] uppercase tracking-[0.2em] font-sans">
                  <span>Open Chapter In Album</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
