import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  SlidersHorizontal,
  Compass,
  Plus,
  ImagePlus
} from 'lucide-react';
import { BookSpreadPage, Photo } from '../../types/portfolio';
import { BookPage } from './BookPage';
import { soundManager } from '../../utils/sound';
import { CHAPTERS } from '../../data/chapters';

interface RealisticBookProps {
  pages: BookSpreadPage[];
  onExit: () => void;
  onOpenPhoto: (photo: Photo) => void;
  onOpenPhotoManager: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const RealisticBook: React.FC<RealisticBookProps> = ({
  pages,
  onExit,
  onOpenPhoto,
  onOpenPhotoManager,
  isMuted,
  onToggleMute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showChaptersMenu, setShowChaptersMenu] = useState<boolean>(false);

  // Initialize PageFlip library
  useEffect(() => {
    if (!containerRef.current) return;

    // Small delay to ensure all DOM nodes are painted
    const initTimer = setTimeout(() => {
      if (!containerRef.current) return;

      const pageElements = containerRef.current.querySelectorAll<HTMLElement>('.stf-page-node');
      if (pageElements.length === 0) return;

      try {
        const pageFlip = new PageFlip(containerRef.current, {
          width: 520,
          height: 700,
          size: 'stretch',
          minWidth: 320,
          maxWidth: 680,
          minHeight: 440,
          maxHeight: 900,
          maxShadowOpacity: 0.6,
          showCover: true,
          mobileScrollSupport: false,
          flippingTime: 800,
          swipeDistance: 25,
          clickEventForward: true,
          useMouseEvents: true,
          showPageCorners: true,
          usePortrait: true
        });

        pageFlip.loadFromHTML(pageElements);

        pageFlip.on('flip', (e: { data: number }) => {
          soundManager.playPageTurn();
          setCurrentPage(e.data);
        });

        pageFlip.on('init', () => {
          setIsReady(true);
        });

        pageFlipInstance.current = pageFlip;
      } catch (err) {
        console.error('Failed to initialize PageFlip', err);
      }
    }, 120);

    return () => {
      clearTimeout(initTimer);
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch {
          // ignore
        }
        pageFlipInstance.current = null;
      }
    };
  }, [pages]);

  // Keyboard navigation (Left / Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        flipNext();
      } else if (e.key === 'ArrowLeft') {
        flipPrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          handleToggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const flipNext = useCallback(() => {
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flipNext('bottom');
    }
  }, []);

  const flipPrev = useCallback(() => {
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flipPrev('bottom');
    }
  }, []);

  const jumpToPage = (pageNum: number) => {
    if (pageFlipInstance.current) {
      pageFlipInstance.current.flip(pageNum);
      setShowChaptersMenu(false);
    }
  };

  const jumpToChapter = (chapterId: string) => {
    const targetIdx = pages.findIndex(p => p.chapter?.id === chapterId && p.layout === 'chapter-intro');
    if (targetIdx !== -1) {
      jumpToPage(targetIdx);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between bg-[#0B0B0B] text-[#F5F2EA] overflow-hidden select-none py-6 px-3 sm:px-6">
      {/* Top Ambient Vignette & Illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] bg-[radial-gradient(ellipse_at_top,_rgba(226,199,153,0.06)_0%,_rgba(11,11,11,0)_70%)] pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-6xl mx-auto py-2 border-b border-[#222222]/40">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Album</span>
        </button>

        {/* Current Chapter or Collection Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowChaptersMenu(!showChaptersMenu)}
            className="flex items-center gap-2 text-xs font-serif tracking-[0.16em] uppercase text-[#E8DCC4] hover:text-white transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#E2C799]" />
            <span className="hidden sm:inline">Chapter Directory</span>
            <span className="sm:hidden">Chapters</span>
          </button>

          {/* Quick-Jump Chapters Dropdown */}
          {showChaptersMenu && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-[#141414] border border-[#2b2926] shadow-2xl p-2 z-50 rounded-xs">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#736E66] px-3 py-1.5 border-b border-[#222]">
                Jump to Chapter
              </div>
              <button
                onClick={() => jumpToPage(0)}
                className="w-full text-left px-3 py-2 text-xs font-serif uppercase tracking-widest text-[#D4CCC0] hover:bg-[#222] transition-colors"
              >
                00 · Cover & Foreword
              </button>
              {CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => jumpToChapter(ch.id)}
                  className="w-full text-left px-3 py-2 text-xs font-serif uppercase tracking-widest text-[#D4CCC0] hover:bg-[#222] transition-colors flex items-center justify-between"
                >
                  <span>{ch.number} · {ch.title}</span>
                  <span className="text-[10px] text-[#666] font-mono">Spread</span>
                </button>
              ))}
              <div className="border-t border-[#222] my-1" />
              <button
                onClick={() => jumpToPage(pages.length - 1)}
                className="w-full text-left px-3 py-2 text-xs font-serif uppercase tracking-widest text-[#888] hover:bg-[#222] transition-colors"
              >
                End · Colophon
              </button>
            </div>
          )}
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPhotoManager}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] font-medium text-[#0B0B0B] bg-[#E2C799] hover:bg-[#F0DEBD] rounded-xs transition-colors cursor-pointer shadow-sm"
            title="Add your own photographs into the album spreads"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Album</span>
            <span className="sm:hidden">Add</span>
          </button>

          <button
            onClick={onOpenPhotoManager}
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors cursor-pointer px-1 py-1"
            title="Manage photos and chapters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors cursor-pointer"
            title={isMuted ? "Unmute paper sound" : "Mute paper sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors cursor-pointer"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen album"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Book Presentation Stage */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-2 max-w-[1300px] w-full mx-auto px-2 sm:px-4">
        {/* Physical Book Shadow on the Table */}
        <div className="absolute w-[80%] max-w-[960px] h-[30px] bottom-0 bg-black/90 rounded-full blur-2xl pointer-events-none transform translate-y-6" />

        {/* Realistic Page Flip Mounting Container */}
        <div className="w-full flex justify-center items-center py-2 sm:py-4">
          <div 
            ref={containerRef} 
            className="relative w-full max-w-[1080px] min-h-[500px] sm:min-h-[640px] md:min-h-[700px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex justify-center"
          >
            {pages.map((p, idx) => (
              <div 
                key={idx} 
                className="stf-page-node shadow-2xl overflow-hidden" 
                data-density={p.density}
              >
                <BookPage 
                  page={p} 
                  totalPages={pages.length}
                  onOpenPhoto={onOpenPhoto}
                  onOpenPhotoManager={onOpenPhotoManager}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tactile Drag & Page Turn Affordance Hint (Disappears after first flip) */}
        {currentPage === 0 && (
          <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-2 text-[#E2C799]/80 animate-pulse">
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans [writing-mode:vertical-rl]">
              Grab edge & drag to turn page →
            </span>
          </div>
        )}
      </div>

      {/* Bottom Minimal Navigation & Spreads Counter */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-4xl mx-auto py-2 border-t border-[#222222]/40">
        <button
          onClick={flipPrev}
          disabled={currentPage <= 0}
          className={`flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] transition-colors cursor-pointer ${
            currentPage <= 0 ? 'text-[#444] cursor-not-allowed' : 'text-[#A8A8A8] hover:text-[#F5F2EA]'
          }`}
          title="Turn to previous page spread (Left arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Spread</span>
        </button>

        {/* Subtle Page Counter */}
        <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#8C8476]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#E2C799]/60" />
            <span>
              {currentPage + 1} <span className="text-[#555]">/</span> {pages.length}
            </span>
          </div>
        </div>

        <button
          onClick={flipNext}
          disabled={currentPage >= pages.length - 1}
          className={`flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] transition-colors cursor-pointer ${
            currentPage >= pages.length - 1 ? 'text-[#444] cursor-not-allowed' : 'text-[#A8A8A8] hover:text-[#F5F2EA]'
          }`}
          title="Turn to next page spread (Right arrow)"
        >
          <span className="hidden sm:inline">Next Spread</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
