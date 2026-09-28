/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Photo, BookSpreadPage, VideoStory, PhotographerProfile } from './types/portfolio';
import {
  getStoredPhotos,
  saveStoredPhotos,
  resetToInitialPhotos,
  fetchServerPhotos,
  persistPhotosToServer,
} from './utils/imageStore';
import {
  getStoredVideos,
  saveStoredVideos,
  fetchServerVideos,
  persistVideosToServer,
} from './utils/videoStore';
import {
  getStoredPhotographer,
  saveStoredPhotographer,
  fetchServerPhotographer,
  persistPhotographerToServer,
} from './utils/photographerStore';
import { buildBookPages } from './utils/bookBuilder';
import { soundManager } from './utils/sound';
import { TopNav } from './components/Navigation/TopNav';
import { IntroHero } from './components/IntroHero';
import { ChaptersOverview } from './components/ChaptersOverview';
import { VideoSection } from './components/Video/VideoSection';
import { AboutSection } from './components/About/AboutSection';
import { ContactSection } from './components/Contact/ContactSection';
import { AlbumContainer } from './components/Album/AlbumContainer';
import { PhotoLightbox } from './components/PhotoViewer/PhotoLightbox';
import { AdminStudio } from './components/Admin/AdminStudio';
import { CinematicLoading } from './components/CinematicLoading';
import { FilmAtmosphere } from './components/FilmAtmosphere';

export default function App() {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'hero' | 'album' | 'about' | 'contact' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#admin/')) {
        return 'admin';
      }
    }
    return 'hero';
  });

  const [photos, setPhotos] = useState<Photo[]>(() => getStoredPhotos());
  const [videos, setVideos] = useState<VideoStory[]>(() => getStoredVideos());
  const [photographer, setPhotographer] = useState<PhotographerProfile>(() => getStoredPhotographer());
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Sync photos, videos, and photographer profile from permanent backend server on load
  useEffect(() => {
    fetchServerPhotos().then((remotePhotos) => {
      if (remotePhotos && Array.isArray(remotePhotos) && remotePhotos.length > 0) {
        setPhotos(remotePhotos);
      }
    });

    fetchServerVideos().then((remoteVideos) => {
      if (remoteVideos && Array.isArray(remoteVideos) && remoteVideos.length > 0) {
        setVideos(remoteVideos);
      }
    });

    fetchServerPhotographer().then((remotePhotographer) => {
      if (remotePhotographer) {
        setPhotographer(remotePhotographer);
      }
    });
  }, []);

  // Listen to browser back/forward and URL changes for /admin
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#admin/')) {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('hero');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [currentView]);

  // Generate spreads dynamically based on current photo collection
  const bookPages: BookSpreadPage[] = useMemo(() => {
    return buildBookPages(photos);
  }, [photos]);

  const handleUpdatePhotos = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    saveStoredPhotos(newPhotos);
    persistPhotosToServer(newPhotos);
  };

  const handleResetPhotos = () => {
    const defaultPhotos = resetToInitialPhotos();
    setPhotos(defaultPhotos);
    persistPhotosToServer(defaultPhotos);
  };

  const handleUpdateVideos = (newVideos: VideoStory[]) => {
    setVideos(newVideos);
    saveStoredVideos(newVideos);
    persistVideosToServer(newVideos);
  };

  const handleUpdatePhotographer = (updated: PhotographerProfile) => {
    setPhotographer(updated);
    saveStoredPhotographer(updated);
    persistPhotographerToServer(updated);
  };

  const handleToggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  const handleNavigate = (view: 'hero' | 'album' | 'videos' | 'about' | 'contact') => {
    if (view === 'album') {
      setCurrentView('album');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView('hero');
    if (window.location.pathname === '/admin' || window.location.hash.startsWith('#admin')) {
      window.history.pushState(null, '', '/');
    }

    if (view === 'videos') {
      videosRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'about') {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'contact') {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    if (window.location.pathname !== '/admin') {
      window.history.pushState(null, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    setCurrentView('hero');
    if (window.location.pathname === '/admin' || window.location.hash.startsWith('#admin')) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterPortfolio = () => {
    setCurrentView('album');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAlbum = () => {
    setCurrentView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (_chapterId: string) => {
    setCurrentView('album');
  };

  // If in exclusive Admin Studio view
  if (currentView === 'admin') {
    return (
      <AdminStudio
        photos={photos}
        onUpdatePhotos={handleUpdatePhotos}
        onExitAdmin={handleExitAdmin}
        videos={videos}
        onUpdateVideos={handleUpdateVideos}
        photographer={photographer}
        onUpdatePhotographer={handleUpdatePhotographer}
      />
    );
  }

  // Regular Visitor Public Monograph View — completely pristine, zero admin buttons
  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F2EA] flex flex-col font-sans selection:bg-[#E2C799] selection:text-[#0B0B0B] relative">
      {/* 35mm film grain, atmospheric dust motes & camera reticle */}
      <FilmAtmosphere />

      {/* Short cinematic reveal on first visit */}
      <CinematicLoading onComplete={() => setHasLoaded(true)} />

      {/* Navigation Top Bar — completely clean, zero admin buttons */}
      <TopNav
        currentView={currentView}
        onNavigate={handleNavigate}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Switching */}
      {currentView === 'album' ? (
        <main className="flex-1 pt-16">
          <AlbumContainer
            pages={bookPages}
            onExit={handleExitAlbum}
            onOpenPhoto={(photo) => setSelectedPhoto(photo)}
            onOpenPhotoManager={handleNavigateToAdmin}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* 1. Cinematic Full-screen Hero */}
          <IntroHero
            heroPhoto={photos[0]}
            onEnterPortfolio={handleEnterPortfolio}
            onScrollToAbout={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
            onScrollToChapters={() => chaptersRef.current?.scrollIntoView({ behavior: 'smooth' })}
          />

          {/* 2. Photography Chapters Overview */}
          <div ref={chaptersRef}>
            <ChaptersOverview photos={photos} onSelectChapter={handleSelectChapter} />
          </div>

          {/* 3. Motion & Visual Stories (4K Cinema Section with uploaded videos) */}
          <div ref={videosRef}>
            <VideoSection videos={videos} />
          </div>

          {/* 4. About the Photographer */}
          <div ref={aboutRef}>
            <AboutSection
              photographer={photographer}
              onUpdatePhotographer={handleUpdatePhotographer}
              availablePhotos={photos}
              onEnterPortfolio={handleEnterPortfolio}
              onNavigateToAdmin={handleNavigateToAdmin}
            />
          </div>

          {/* 5. Contact & Inquiries */}
          <div ref={contactRef}>
            <ContactSection onNavigateToAdmin={handleNavigateToAdmin} />
          </div>
        </main>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        allPhotos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </div>
  );
}
