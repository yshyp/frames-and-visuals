import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Camera,
  MapPin,
  Instagram,
  Youtube,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { VideoStory } from '../../types/portfolio';
import { INITIAL_VIDEOS } from '../../data/videos';
import { PHOTOGRAPHER_INFO } from '../../data/photos';

interface VideoSectionProps {
  videos?: VideoStory[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos: propVideos }) => {
  const [videos, setVideos] = useState<VideoStory[]>(propVideos || INITIAL_VIDEOS);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedVideo = videos[selectedIndex] || videos[0] || INITIAL_VIDEOS[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when propVideos updates from server
  useEffect(() => {
    if (propVideos && propVideos.length > 0) {
      setVideos(propVideos);
    }
  }, [propVideos]);

  // When changing selected reel
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [selectedIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    videoRef.current.currentTime = percentage * (videoRef.current.duration || 0);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatSeconds = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Fade out controls during active playback
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#090909] text-[#F5F2EA] border-t border-[#1C1B19] overflow-hidden">
      {/* Subtle ambient gradient flare in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-3.5 h-3.5 text-[#E2C799]" />
              <span className="text-xs uppercase tracking-[0.35em] text-[#A89F91] font-mono">
                9:16 Vertical Cinema
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-[0.16em] uppercase text-[#F5F2EA] font-light">
              Reels & Visual Shorts
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37]/50 mt-4 mb-4" />
            <p className="text-sm sm:text-base text-[#A8A297] font-sans font-light max-w-xl leading-relaxed">
              Capturing drone perspectives, wildlife moments, and macro behavior in high-definition 9:16 vertical reels formatted for immersive mobile cinema.
            </p>
          </div>

          {/* Social Badges (Instagram Reels & YouTube Shorts) */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
            <a
              href={PHOTOGRAPHER_INFO.socials.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#141311] hover:bg-[#1E1C19] border border-[#2B2925] hover:border-[#E2C799]/50 transition-colors text-xs font-mono text-[#E2C799]"
            >
              <Instagram className="w-4 h-4 text-[#E2C799]" />
              <span>@frames_by_ysh</span>
              <ExternalLink className="w-3 h-3 text-[#777]" />
            </a>

            <a
              href={PHOTOGRAPHER_INFO.socials.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#141311] hover:bg-[#1E1C19] border border-[#2B2925] hover:border-[#E2C799]/50 transition-colors text-xs font-mono text-[#E2C799]"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>YouTube Shorts</span>
              <ExternalLink className="w-3 h-3 text-[#777]" />
            </a>
          </div>
        </div>

        {/* 9:16 Vertical Cinema Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Column 1: Vertical 9:16 Reel Player */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Ambient Backlight Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
              {/* Blurred background glow from current reel thumbnail */}
              <div
                className="absolute inset-0 bg-cover bg-center rounded-3xl blur-2xl opacity-30 transform scale-95 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }}
              />

              {/* 9:16 Vertical Device / Frame Viewport */}
              <div
                onMouseMove={handleUserActivity}
                onTouchStart={handleUserActivity}
                className="relative aspect-[9/16] w-full bg-black rounded-2xl overflow-hidden border border-[#2F2C27] shadow-2xl group select-none ring-1 ring-[#D4AF37]/20"
              >
                {/* Vertical HTML5 Video */}
                <video
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  poster={selectedVideo.thumbnail}
                  muted={isMuted}
                  playsInline
                  loop
                  onTimeUpdate={handleTimeUpdate}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer bg-black"
                />

                {/* Big Center Play / Pause Animated Icon */}
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-black/30"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#E2C799]/90 hover:bg-[#E2C799] text-[#0B0B0B] flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                      <Play className="w-7 h-7 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Top Badge Overlay */}
                <div
                  className={`absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none transition-opacity duration-300 ${
                    showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#E2C799] font-mono rounded-xs">
                      9:16 REEL
                    </span>
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#F5F2EA] font-mono rounded-xs">
                      {selectedVideo.category}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono bg-black/75 backdrop-blur-md text-[#C4B291] rounded-xs">
                    {selectedVideo.duration}
                  </span>
                </div>

                {/* Next / Previous Quick Nav floating buttons */}
                <div
                  className={`absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none transition-opacity duration-300 ${
                    showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#F5F2EA] pointer-events-auto transition-transform hover:scale-110 border border-white/10"
                    title="Previous Reel"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#F5F2EA] pointer-events-auto transition-transform hover:scale-110 border border-white/10"
                    title="Next Reel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Overlay Controls */}
                <div
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex flex-col gap-2 transition-opacity duration-300 ${
                    showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Scrubber Timeline */}
                  <div
                    onClick={handleSeek}
                    className="w-full h-1 bg-white/20 hover:h-1.5 transition-all rounded-xs cursor-pointer relative"
                  >
                    <div
                      className="h-full bg-[#E2C799]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Play / Mute / Fullscreen actions */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#DDD] pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 hover:text-[#E2C799] transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-1 hover:text-[#E2C799] transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-[#888]" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-[#E2C799]" />
                        )}
                      </button>

                      <span className="text-[10px] text-[#A8A297]">
                        {formatSeconds(currentTime)} / {formatSeconds(duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 hover:text-[#E2C799] transition-colors cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reel Counter & Quick Switcher below phone */}
              <div className="flex items-center justify-between px-2 pt-3 text-[11px] font-mono text-[#777]">
                <span>
                  Reel {selectedIndex + 1} of {videos.length}
                </span>
                <span className="text-[#A89F91]">Tap video to play / pause</span>
              </div>
            </div>
          </div>

          {/* Column 2: Story Synopsis, Meta & Vertical Reel Selector */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Story Card */}
            <div className="p-6 md:p-8 bg-[#121110] border border-[#24221F]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#E2C799] font-mono">
                  {selectedVideo.category} · 9:16 Short
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#8E877C] font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#E2C799]/80" />
                  <span>{selectedVideo.location}</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.1em] text-[#F5F2EA] mb-3">
                {selectedVideo.title}
              </h3>

              <p className="text-sm text-[#A89F91] leading-relaxed mb-6 font-sans font-light">
                {selectedVideo.description}
              </p>

              {/* Technical Gear Strip */}
              {selectedVideo.gear && (
                <div className="pt-4 border-t border-[#24221F] flex items-center gap-2.5 text-xs font-mono text-[#736E66]">
                  <Camera className="w-3.5 h-3.5 text-[#E2C799]" />
                  <span>Recorded with:</span>
                  <span className="text-[#C4B291]">{selectedVideo.gear}</span>
                </div>
              )}
            </div>

            {/* Vertical Shorts Library / Strip */}
            <div>
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#E2C799] font-mono font-medium">
                  More 9:16 Shorts & Reels
                </span>
                <span className="text-[11px] text-[#777] font-mono">
                  {videos.length} Vertical Clips
                </span>
              </div>

              {/* Horizontal Scrollable Strip of 9:16 Vertical Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {videos.map((vid, idx) => {
                  const isCurrent = idx === selectedIndex;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`relative aspect-[9/16] bg-[#141312] border overflow-hidden text-left transition-all cursor-pointer group flex flex-col justify-end p-2.5 rounded-sm ${
                        isCurrent
                          ? 'border-[#E2C799] ring-2 ring-[#E2C799]/30 shadow-lg'
                          : 'border-[#24221F] opacity-75 hover:opacity-100 hover:border-[#3D3A33]'
                      }`}
                    >
                      {/* Background Thumbnail */}
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Dark Gradient Overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-black/80 text-[#E2C799] rounded-xs">
                          {vid.category}
                        </span>
                        <span className="text-[8px] font-mono px-1 py-0.5 bg-black/80 text-[#DDD] rounded-xs">
                          {vid.duration}
                        </span>
                      </div>

                      {/* Play Indicator Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-[#E2C799] text-[#0B0B0B] flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="relative z-10">
                        <h4 className="font-serif text-[11px] text-[#F5F2EA] line-clamp-2 leading-tight mb-0.5">
                          {vid.title}
                        </h4>
                        <p className="text-[9px] text-[#8C8476] font-mono truncate">
                          {vid.location}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
