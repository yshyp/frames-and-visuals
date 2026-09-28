import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Lock,
  Unlock,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  RefreshCw,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Camera,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Download,
  Plus,
  Film,
  Youtube,
  Play,
  Clock,
  MapPin
} from 'lucide-react';
import { Photo, Category, VideoStory, PhotographerProfile } from '../../types/portfolio';
import {
  uploadImageToServer,
  persistPhotosToServer,
  resetToInitialPhotos
} from '../../utils/imageStore';
import {
  uploadLocalVideoFile,
  captureVideoPoster,
  deleteVideoFromServer,
  persistVideosToServer
} from '../../utils/videoStore';
import {
  getStoredPhotographer,
  persistPhotographerToServer,
  uploadPortraitImage
} from '../../utils/photographerStore';
import { createPhotoArtwork } from '../../data/artworks';

interface AdminStudioProps {
  photos: Photo[];
  onUpdatePhotos: (photos: Photo[]) => void;
  onExitAdmin: () => void;
  videos: VideoStory[];
  onUpdateVideos: (videos: VideoStory[]) => void;
  photographer?: PhotographerProfile;
  onUpdatePhotographer?: (photographer: PhotographerProfile) => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  photos,
  onUpdatePhotos,
  onExitAdmin,
  videos,
  onUpdateVideos,
  photographer: initialPhotographer,
  onUpdatePhotographer,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        sessionStorage.getItem('ysh_admin_auth') === 'true' ||
        localStorage.getItem('ysh_admin_auth_persisted') === 'true'
      );
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'macro-originals' | 'upload-new' | 'manage-all' | 'videos' | 'photographer' | 'export'>(
    'macro-originals'
  );

  // Photographer profile state in admin
  const [photographerProfile, setPhotographerProfile] = useState<PhotographerProfile>(() => {
    return initialPhotographer || getStoredPhotographer();
  });
  const [stagedPortraitFile, setStagedPortraitFile] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [isSavingPhotographer, setIsSavingPhotographer] = useState(false);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  // Status banners & feedback
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Filter for manage-all tab
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Single photo upload form state
  const [uploadCategory, setUploadCategory] = useState<Category>('Macro');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadLocation, setUploadLocation] = useState('Western Ghats, Kerala');
  const [uploadCamera, setUploadCamera] = useState('Nikon Z6III');
  const [uploadLens, setUploadLens] = useState('105mm f/2.8 Micro VR');
  const [uploadAperture, setUploadAperture] = useState('f/8.0');
  const [uploadShutter, setUploadShutter] = useState('1/200s');
  const [uploadIso, setUploadIso] = useState('ISO 250');
  const [uploadStory, setUploadStory] = useState('');
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Video Upload States
  const [stagedVideoFile, setStagedVideoFile] = useState<File | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [videoProgressText, setVideoProgressText] = useState<string>('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<Category>('Macro');
  const [videoLocation, setVideoLocation] = useState('Western Ghats, Kerala');
  const [videoGear, setVideoGear] = useState('Nikon Z6III · 105mm Micro VR · 4K 120p N-Log');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoDuration, setVideoDuration] = useState('02:30');
  const [videoPoster, setVideoPoster] = useState<string>('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // GitHub push state
  const [gitRepoName, setGitRepoName] = useState('frames-and-visuals');
  const [gitToken, setGitToken] = useState('');
  const [isPushingGit, setIsPushingGit] = useState(false);
  const [gitFeedback, setGitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePushToGithub = async () => {
    if (!gitRepoName.trim()) {
      setGitFeedback({ type: 'error', message: 'Please specify the repository name.' });
      return;
    }
    setIsPushingGit(true);
    setGitFeedback(null);
    try {
      const cleanRepo = gitRepoName.trim().replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
      const fullRepoUrl = cleanRepo.includes('/') ? `https://github.com/${cleanRepo}.git` : `https://github.com/yshyp/${cleanRepo}.git`;

      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: fullRepoUrl,
          token: gitToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to push');
      }
      setGitFeedback({ type: 'success', message: `Pushed successfully to ${fullRepoUrl} (branch: main)` });
      showToast('success', 'Git repository pushed to GitHub!');
    } catch (err: any) {
      setGitFeedback({ type: 'error', message: err.message || 'Push failed. Please verify that the repository exists on GitHub and that your token has write access.' });
      showToast('error', err.message || 'Push failed');
    } finally {
      setIsPushingGit(false);
    }
  };

  // Check server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setServerOnline(true);
      })
      .catch(() => setServerOnline(false));
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcode.trim();
    if (clean === 'ysh2026' || clean === 'admin' || clean === 'vaisakh' || clean === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('ysh_admin_auth', 'true');
      if (rememberMe) {
        localStorage.setItem('ysh_admin_auth_persisted', 'true');
      }
      showToast('success', 'Admin session authenticated. Welcome, Vaisakh.');
    } else {
      setAuthError('Invalid passcode. Default passcode is: ysh2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ysh_admin_auth');
    localStorage.removeItem('ysh_admin_auth_persisted');
    setPasscode('');
  };

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const availableCategories = useMemo(() => {
    const base = ['Macro', 'Wildlife', 'Nature', 'Travel', 'Visual Stories'];
    const custom = Array.from(new Set(photos.map((p) => p.category))).filter(
      (c) => !base.includes(c)
    );
    return [...base, ...custom];
  }, [photos]);

  // Target 5 Macro Plates identified from user uploads
  const macroPlates = useMemo(() => {
    return [
      {
        targetId: 'mc-01',
        filenameLabel: 'YSH_7289.jpg',
        title: 'Amber Facets on Gold (YSH_7289)',
        subject: 'Golden Wasp resting on wild yellow blossom',
        lens: '105mm f/2.8 Micro VR',
      },
      {
        targetId: 'mc-02',
        filenameLabel: 'DSC_0099-7.jpg (or DSC_0099.jpg)',
        title: "The Robber's Iridescent Gaze (DSC_0099)",
        subject: 'Robber Fly with multifaceted emerald compound eyes',
        lens: '105mm f/2.8 Micro VR',
      },
      {
        targetId: 'mc-03',
        filenameLabel: 'DSC_6917 Topaz Gigapixel.jpg (or DSC_6917.jpg)',
        title: 'Emerald Sentinel in Jade (DSC_6917)',
        subject: 'Juvenile Praying Mantis head & raptorial legs',
        lens: '105mm f/2.8 Micro VR',
      },
      {
        targetId: 'mc-04',
        filenameLabel: 'YSH_0950-topaz-sharpen.jpg (or YSH_0950.jpg)',
        title: 'Curious Vision — Salticidae (YSH_0950)',
        subject: 'Salticidae Jumping Spider eye catchlight',
        lens: '105mm f/2.8 Micro VR',
      },
      {
        targetId: 'mc-05',
        filenameLabel: 'DSC_6917-topaz-sharpen-focus.jpg',
        title: 'Ommatidia Architecture (DSC_6917 Focus)',
        subject: 'Microscopic Chitin Ommatidia Focus Study',
        lens: '105mm f/2.8 Micro VR + Tubes',
      },
    ];
  }, []);

  // Quick Replace specific Macro plate with original camera file
  const handleReplacePlate = async (photoId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid JPG, PNG, or WebP photo.');
      return;
    }

    setIsUploading(true);
    showToast('info', `Uploading original file: ${file.name}...`);

    try {
      const result = await uploadImageToServer(file, `images/macro/${file.name}`);

      const updated = photos.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            image: result.url,
          };
        }
        return p;
      });

      onUpdatePhotos(updated);
      await persistPhotosToServer(updated);
      setIsUploading(false);
      showToast(
        'success',
        `Original photo for ${file.name} permanently saved and published to live monograph!`
      );
    } catch (err) {
      setIsUploading(false);
      showToast('error', 'Failed to upload photo file. Please try again.');
    }
  };

  // Handle uploading new photos
  const handleCommitNewPhotos = async () => {
    if (stagedFiles.length === 0) {
      showToast('error', 'Please choose or drag at least one photograph to upload.');
      return;
    }

    setIsUploading(true);
    showToast('info', `Uploading and persisting ${stagedFiles.length} photograph(s)...`);

    const finalCategory = isCreatingNewCategory
      ? customCategoryInput.trim() || 'Custom'
      : uploadCategory;

    try {
      const newPhotoList: Photo[] = [];

      for (let i = 0; i < stagedFiles.length; i++) {
        const file = stagedFiles[i];
        const res = await uploadImageToServer(file);

        const cleanTitle =
          uploadTitle && stagedFiles.length === 1
            ? uploadTitle
            : file.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]+/g, ' ')
                .trim();

        const newPhoto: Photo = {
          id: `custom-${Date.now()}-${i}`,
          title: cleanTitle,
          category: finalCategory,
          image: res.url,
          location: uploadLocation || 'Kerala, India',
          camera: uploadCamera || 'Nikon Z6III',
          lens: uploadLens || '',
          aperture: uploadAperture || 'f/5.6',
          shutter: uploadShutter || '1/250s',
          iso: uploadIso || 'ISO 200',
          story: uploadStory || `Plate captured by Vaisakh Y P.`,
          aspectRatio: 'landscape',
          featured: true,
        };

        newPhotoList.push(newPhoto);
      }

      const merged = [...photos, ...newPhotoList];
      onUpdatePhotos(merged);
      await persistPhotosToServer(merged);

      setStagedFiles([]);
      setUploadTitle('');
      setUploadStory('');
      setIsUploading(false);
      showToast(
        'success',
        `Successfully published ${newPhotoList.length} photo(s) to "${finalCategory}" chapter!`
      );
    } catch (err) {
      setIsUploading(false);
      showToast('error', 'Failed to upload photographs.');
    }
  };

  // Reordering photos
  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const reordered = [...photos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    onUpdatePhotos(reordered);
    await persistPhotosToServer(reordered);
    showToast('info', 'Monograph sequence updated.');
  };

  // Delete photo
  const handleDeletePhoto = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the monograph?`)) {
      return;
    }

    const filtered = photos.filter((p) => p.id !== id);
    onUpdatePhotos(filtered);
    await persistPhotosToServer(filtered);
    showToast('info', `Photo "${title}" removed.`);
  };

  // --- VIDEO HANDLERS (Upload, Arrange, Delete) ---
  const handleVideoFileSelected = async (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      showToast('error', 'Please choose a valid video file (.mp4, .webm, .mov)');
      return;
    }

    setStagedVideoFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
    setVideoTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    showToast('info', 'Reading video metadata and generating poster snapshot...');

    try {
      const { posterDataUrl, durationSec } = await captureVideoPoster(file);
      if (posterDataUrl) {
        setVideoPoster(posterDataUrl);
      }
      if (durationSec > 0) {
        const mins = Math.floor(durationSec / 60);
        const secs = Math.floor(durationSec % 60);
        setVideoDuration(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    } catch {
      // fallback
    }
  };

  const handleCommitVideoUpload = async () => {
    if (!stagedVideoFile) {
      showToast('error', 'Please select a video file first.');
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    setVideoProgressText('Preparing video upload...');

    try {
      const uploadRes = await uploadLocalVideoFile(stagedVideoFile, (percent, loaded, total) => {
        setVideoUploadProgress(percent);
        const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (total / (1024 * 1024)).toFixed(1);
        setVideoProgressText(`${percent}% (${loadedMB} MB / ${totalMB} MB)`);
      });

      const newVideo: VideoStory = {
        id: `vid-${Date.now()}`,
        title: videoTitle.trim() || stagedVideoFile.name,
        category: videoCategory,
        location: videoLocation || 'Western Ghats, Kerala',
        description: videoDescription || 'Field footage captured by Vaisakh Y P.',
        duration: videoDuration || '02:30',
        thumbnail: videoPoster || createPhotoArtwork('macro-praying-mantis'),
        videoUrl: uploadRes.url,
        gear: videoGear || 'Nikon Z6III · 4K',
        youtubeUrl: 'https://youtube.com/@FramesandVisualsbyYsh',
        featured: true,
      };

      const updated = [newVideo, ...videos];
      onUpdateVideos(updated);
      await persistVideosToServer(updated);

      setStagedVideoFile(null);
      setVideoPoster('');
      setVideoUploadProgress(null);
      setVideoTitle('');
      setVideoDescription('');
      setIsUploadingVideo(false);
      showToast('success', `Video "${newVideo.title}" uploaded and added to the live reel!`);
    } catch (err) {
      setIsUploadingVideo(false);
      setVideoUploadProgress(null);
      showToast('error', 'Video upload failed. Check file size or server connection.');
    }
  };

  // Reordering videos
  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const reordered = [...videos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    onUpdateVideos(reordered);
    await persistVideosToServer(reordered);
    showToast('info', 'Video playlist order updated.');
  };

  // Delete video
  const handleDeleteVideo = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete video "${title}"? This will remove the file from the server.`)) {
      return;
    }

    await deleteVideoFromServer(id);
    const remaining = videos.filter((v) => v.id !== id);
    onUpdateVideos(remaining);
    await persistVideosToServer(remaining);
    showToast('info', `Video "${title}" deleted.`);
  };

  // Reset to factory defaults
  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset all photos back to initial curated defaults? Any custom uploads will be cleared.'
      )
    ) {
      return;
    }
    const defaults = resetToInitialPhotos();
    onUpdatePhotos(defaults);
    await persistPhotosToServer(defaults);
    showToast('success', 'Reset complete. Loaded default curated monograph.');
  };

  // Copy exclusive admin link
  const handleCopyAdminLink = () => {
    const fullUrl = `${window.location.origin}/admin`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      showToast('info', 'Admin URL copied to clipboard.');
    });
  };

  // Download photos.json
  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(photos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `frames_and_visuals_photos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Backup JSON downloaded.');
  };

  // --- PASSCODE LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2EA] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121212] border border-[#262421] p-8 md:p-10 shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#1A1917] border border-[#E2C799]/40 flex items-center justify-center mb-4 text-[#E2C799] shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#A89F91] font-mono mb-1">
              Curator & Administrator Studio
            </span>
            <h1 className="text-xl md:text-2xl font-serif tracking-[0.18em] uppercase text-[#F5F2EA]">
              FRAMES & VISUALS
            </h1>
            <p className="text-xs text-[#8E877C] mt-2 font-sans font-light">
              Exclusive portal for Vaisakh Y P to upload camera originals and manage live monograph spreads.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2.5 text-red-200 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#C4B291] mb-2 font-mono">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin key (default: ysh2026)"
                className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-4 py-3 text-sm focus:outline-none focus:border-[#E2C799] transition-colors font-mono tracking-wider"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#A89F91]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#1A1917] border-[#33302A] text-[#E2C799] focus:ring-0"
                />
                <span>Remember on this browser</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setPasscode('ysh2026');
                }}
                className="text-[#E2C799] hover:underline cursor-pointer text-[11px]"
              >
                Quick Demo Key
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#E8DCC4] hover:bg-[#F5EFE3] text-[#0B0B0B] font-sans font-medium text-xs uppercase tracking-[0.25em] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Studio</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#22201D] flex items-center justify-between text-[11px] text-[#635E56]">
            <button
              onClick={onExitAdmin}
              className="hover:text-[#F5F2EA] transition-colors cursor-pointer"
            >
              ← Return to Public Portfolio
            </button>
            <span className="font-mono">KEY: ysh2026</span>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN STUDIO ---
  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F2EA] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0E0E0D]/95 backdrop-blur-md border-b border-[#24221F] px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] font-sans text-[#A89F91] hover:text-[#F5F2EA] border border-[#2B2925] hover:border-[#E2C799] transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>← Live Monograph</span>
          </button>
          <div className="h-5 w-[1px] bg-[#2B2925] hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#E2C799] font-serif font-bold">
                Admin Studio
              </span>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-[#1E1C19] border border-[#3E3932] text-[#A89F91] rounded-xs font-mono">
                Exclusive Link
              </span>
            </div>
            <p className="text-[11px] text-[#736E66] hidden md:block">
              Vaisakh Y P · Permanent Monograph Publishing Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs px-3 py-1 bg-[#131210] border border-[#262420] text-[#A89F91] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                serverOnline === true ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              {serverOnline === true
                ? 'Server Disk Storage: Active'
                : 'Local Cache Mode'}
            </span>
            <span className="text-[#555]">·</span>
            <span>{photos.length} Plates</span>
            <span className="text-[#555]">·</span>
            <span>{videos.length} Videos</span>
          </div>

          <button
            onClick={handleCopyAdminLink}
            className="px-3 py-1.5 text-xs text-[#E2C799] border border-[#E2C799]/40 hover:bg-[#E2C799]/10 transition-colors flex items-center gap-1.5 cursor-pointer font-sans uppercase tracking-wider"
            title="Copy this private URL for admin access"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Link' : 'Copy Admin Link'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-[#736E66] hover:text-red-400 transition-colors cursor-pointer"
            title="Lock & Log out of Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {statusMessage && (
        <div
          className={`px-6 py-3 text-xs flex items-center justify-between font-sans border-b ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-red-950/70 border-red-800 text-red-200'
              : 'bg-[#1E1C19] border-[#38332A] text-[#E2C799]'
          }`}
        >
          <div className="flex items-center gap-2.5 max-w-4xl mx-auto w-full">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 border-b border-[#24221F] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('macro-originals')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'macro-originals'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Macro Plates (Original Files)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload-new')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'upload-new'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photographs</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-all')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'manage-all'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Manage All Plates ({photos.length})</span>
          </button>

          {/* Videos & Motion Stories Tab */}
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>9:16 Reels & Shorts ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('photographer')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'photographer'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photographer Profile & Portrait</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 ${
              activeTab === 'export'
                ? 'bg-[#E2C799] text-[#0B0B0B]'
                : 'text-[#A89F91] hover:text-[#F5F2EA] bg-[#141311] border border-[#24221F]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Backup & Settings</span>
          </button>
        </div>

        {/* TAB 1: MACRO ORIGINAL CAMERA FILES */}
        {activeTab === 'macro-originals' && (
          <div className="space-y-6">
            <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#E2C799] font-mono block mb-1">
                    Direct Camera File Sync
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                    Original Macro Camera Plates
                  </h2>
                  <p className="text-xs text-[#9E9689] mt-1 max-w-2xl font-sans">
                    Click below to link your high-resolution camera JPG files. Once uploaded, the physical monograph will display your true original camera photographs permanently for all visitors!
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-3 py-1 bg-[#1A1916] border border-[#38332A] text-xs font-mono text-[#E2C799]">
                    Chapter 02 — Macro
                  </span>
                </div>
              </div>

              {/* 5 Macro Plate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {macroPlates.map((plate, index) => {
                  const currentPhoto = photos.find((p) => p.id === plate.targetId);
                  const isOriginalUploaded =
                    currentPhoto &&
                    !currentPhoto.image.startsWith('data:image/svg+xml') &&
                    (currentPhoto.image.startsWith('/uploads') ||
                      currentPhoto.image.startsWith('/images') ||
                      currentPhoto.image.startsWith('http') ||
                      currentPhoto.image.startsWith('data:image/jpeg') ||
                      currentPhoto.image.startsWith('data:image/png'));

                  return (
                    <div
                      key={plate.targetId}
                      className="bg-[#181714] border border-[#2B2824] hover:border-[#E2C799]/50 transition-all p-5 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Plate Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-mono uppercase text-[#E2C799] tracking-wider">
                            Plate 0{index + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-xs font-mono ${
                              isOriginalUploaded
                                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                                : 'bg-amber-950/80 border border-amber-700 text-amber-300'
                            }`}
                          >
                            {isOriginalUploaded ? 'Original Active' : 'Artwork Placeholder'}
                          </span>
                        </div>

                        {/* Image Preview Container */}
                        <div className="w-full aspect-[4/3] bg-black/50 border border-[#2B2824] mb-4 overflow-hidden relative group">
                          {currentPhoto?.image ? (
                            <img
                              src={currentPhoto.image}
                              alt={plate.title}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#555]">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <h3 className="font-serif text-sm text-[#F5F2EA] mb-1 line-clamp-1">
                          {plate.title}
                        </h3>
                        <p className="text-[11px] text-[#A89F91] mb-2 leading-relaxed">
                          {plate.subject}
                        </p>
                        <div className="text-[10px] text-[#736E66] font-mono mb-4">
                          Target file: <span className="text-[#C4B291]">{plate.filenameLabel}</span>
                        </div>
                      </div>

                      {/* Upload Button */}
                      <div>
                        <label className="w-full py-2.5 px-3 bg-[#24221E] hover:bg-[#E2C799] hover:text-[#0B0B0B] text-[#E8DCC4] text-[11px] uppercase tracking-[0.18em] font-medium border border-[#3A362E] hover:border-[#E2C799] transition-all cursor-pointer flex items-center justify-center gap-2 select-none">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isOriginalUploaded ? 'Replace Original File' : 'Upload Original File'}
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleReplacePlate(plate.targetId, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD NEW PHOTOGRAPHS */}
        {activeTab === 'upload-new' && (
          <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#E2C799] font-mono block mb-1">
                  New Monograph Plates
                </span>
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                  Upload & Stage Photographs
                </h2>
                <p className="text-xs text-[#9E9689] mt-1 font-sans">
                  Select or drag your camera photographs. You can assign them to existing chapters or create a brand new exhibition album.
                </p>
              </div>

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const valid = Array.from(e.dataTransfer.files).filter((f) =>
                      f.type.startsWith('image/')
                    );
                    setStagedFiles((prev) => [...prev, ...valid]);
                  }
                }}
                className="border-2 border-dashed border-[#3D3930] hover:border-[#E2C799] p-8 text-center transition-colors bg-[#161513] cursor-pointer"
              >
                <Upload className="w-10 h-10 text-[#E2C799] mx-auto mb-3" />
                <h4 className="font-serif text-base text-[#F5F2EA] mb-1">
                  Drag & Drop Photographs Here
                </h4>
                <p className="text-xs text-[#8A8376] font-sans mb-4">
                  Supports high-resolution JPEG, PNG, and WebP files
                </p>
                <label className="inline-block px-5 py-2.5 bg-[#E8DCC4] hover:bg-[#F5EFE3] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const valid = Array.from(e.target.files).filter((f) =>
                          f.type.startsWith('image/')
                        );
                        setStagedFiles((prev) => [...prev, ...valid]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Staged Files Preview */}
              {stagedFiles.length > 0 && (
                <div className="bg-[#181715] border border-[#2B2925] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-mono text-[#E2C799]">
                      {stagedFiles.length} file(s) selected
                    </span>
                    <button
                      onClick={() => setStagedFiles([])}
                      className="text-red-400 hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {stagedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="bg-[#201F1C] p-2 border border-[#33302A] text-[11px] flex flex-col justify-between"
                      >
                        <span className="font-mono truncate mb-1">{file.name}</span>
                        <span className="text-[10px] text-[#777]">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Form */}
              <div className="space-y-4 pt-4 border-t border-[#24221F]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                      Chapter / Album
                    </label>
                    {!isCreatingNewCategory ? (
                      <div className="flex gap-2">
                        <select
                          value={uploadCategory}
                          onChange={(e) => {
                            if (e.target.value === '__NEW__') {
                              setIsCreatingNewCategory(true);
                            } else {
                              setUploadCategory(e.target.value as Category);
                            }
                          }}
                          className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E2C799]"
                        >
                          {availableCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                          <option value="__NEW__">+ Create New Album...</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="e.g. Western Ghats Birds"
                          className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E2C799]"
                        />
                        <button
                          type="button"
                          onClick={() => setIsCreatingNewCategory(false)}
                          className="px-3 py-2 text-xs bg-[#24221E] text-[#A89F91] hover:text-[#F5F2EA]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                      Title (Optional for multiple)
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Monsoon Predator"
                      className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E2C799]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#736E66] mb-1 font-mono">
                      Camera
                    </label>
                    <input
                      type="text"
                      value={uploadCamera}
                      onChange={(e) => setUploadCamera(e.target.value)}
                      className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#736E66] mb-1 font-mono">
                      Lens
                    </label>
                    <input
                      type="text"
                      value={uploadLens}
                      onChange={(e) => setUploadLens(e.target.value)}
                      className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#736E66] mb-1 font-mono">
                      Aperture / Shutter
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={uploadAperture}
                        onChange={(e) => setUploadAperture(e.target.value)}
                        className="w-1/2 bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-2 py-2 text-xs"
                      />
                      <input
                        type="text"
                        value={uploadShutter}
                        onChange={(e) => setUploadShutter(e.target.value)}
                        className="w-1/2 bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-2 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-[#736E66] mb-1 font-mono">
                      Location
                    </label>
                    <input
                      type="text"
                      value={uploadLocation}
                      onChange={(e) => setUploadLocation(e.target.value)}
                      className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                    Story / Curator Commentary
                  </label>
                  <textarea
                    rows={2}
                    value={uploadStory}
                    onChange={(e) => setUploadStory(e.target.value)}
                    placeholder="Field notes, habitat context, or photographic observation..."
                    className="w-full bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2 text-xs focus:outline-none focus:border-[#E2C799] resize-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={stagedFiles.length === 0 || isUploading}
                  onClick={handleCommitNewPhotos}
                  className="w-full py-3.5 bg-[#E2C799] hover:bg-[#F0DEBD] disabled:bg-[#333] disabled:text-[#666] text-[#0B0B0B] font-medium text-xs uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {isUploading
                      ? 'Uploading & Saving to Server...'
                      : `Publish ${stagedFiles.length} Photograph(s) Permanently`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE ALL PLATES */}
        {activeTab === 'manage-all' && (
          <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                  Monograph Catalog & Ordering
                </h2>
                <p className="text-xs text-[#9E9689] mt-0.5">
                  Reorder spreads, edit metadata, or replace photos. Changes are saved permanently to the live server.
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#736E66] font-mono">
                  Filter:
                </span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-[#181715] border border-[#33302A] text-[#F5F2EA] px-3 py-1.5 text-xs focus:outline-none focus:border-[#E2C799]"
                >
                  <option value="All">All Chapters ({photos.length})</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c} ({photos.filter((p) => p.category === c).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photos List Table */}
            <div className="space-y-3">
              {photos
                .filter((p) => filterCategory === 'All' || p.category === filterCategory)
                .map((photo, index) => {
                  const globalIdx = photos.findIndex((p) => p.id === photo.id);
                  const isSvg = photo.image.startsWith('data:image/svg+xml');

                  return (
                    <div
                      key={photo.id}
                      className="bg-[#181714] border border-[#262420] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3D3A33] transition-colors"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black shrink-0 border border-[#2B2925] overflow-hidden flex items-center justify-center">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[#222] text-[#E2C799] font-mono">
                              {photo.category}
                            </span>
                            <span className="text-[10px] font-mono text-[#666]">
                              Plate #{globalIdx + 1}
                            </span>
                            {isSvg ? (
                              <span className="text-[9px] px-1.5 py-0.2 bg-amber-950/60 text-amber-300 font-mono">
                                Vector Plate
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 font-mono">
                                Camera Original
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm text-[#F5F2EA] mt-1">{photo.title}</h4>
                          <p className="text-[11px] text-[#888] font-mono line-clamp-1">
                            {photo.camera} · {photo.lens} · {photo.aperture} · {photo.location}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          disabled={globalIdx === 0}
                          onClick={() => handleMovePhoto(globalIdx, 'up')}
                          className="p-2 bg-[#22201D] hover:bg-[#333] disabled:opacity-30 text-[#A89F91] transition-colors cursor-pointer"
                          title="Move earlier in book"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={globalIdx === photos.length - 1}
                          onClick={() => handleMovePhoto(globalIdx, 'down')}
                          className="p-2 bg-[#22201D] hover:bg-[#333] disabled:opacity-30 text-[#A89F91] transition-colors cursor-pointer"
                          title="Move later in book"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <label
                          className="p-2 bg-[#22201D] hover:bg-[#E2C799] hover:text-[#0B0B0B] text-[#A89F91] transition-colors cursor-pointer"
                          title="Replace photo file"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleReplacePlate(photo.id, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() => handleDeletePhoto(photo.id, photo.title)}
                          className="p-2 bg-[#22201D] hover:bg-red-900/60 hover:text-red-200 text-[#777] transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: VIDEOS & MOTION STORIES (Upload, Arrange, Delete) */}
        {activeTab === 'videos' && (
          <div className="space-y-8">
            {/* Header info */}
            <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#E2C799] font-mono block mb-1">
                    9:16 Vertical Reel Manager
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                    Upload, Arrange & Delete 9:16 Reels & Shorts
                  </h2>
                  <p className="text-xs text-[#9E9689] mt-1 max-w-2xl font-sans">
                    Upload your vertical reels and shorts (.mp4, .mov, .webm) directly to local storage. Optimized for 9:16 Instagram Reels, YouTube Shorts, and vertical cinematography.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#1A1916] border border-[#38332A] text-xs font-mono text-[#E2C799]">
                    {videos.length} 9:16 Reels
                  </span>
                </div>
              </div>

              {/* Video Upload Form */}
              <div className="bg-[#161513] border border-[#2E2B26] p-6 space-y-6">
                <h3 className="font-serif text-base uppercase tracking-wider text-[#E8DCC4] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#E2C799]" />
                  <span>Upload Local 9:16 Reel / Short</span>
                </h3>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleVideoFileSelected(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-[#3D3930] hover:border-[#E2C799] p-8 text-center transition-colors bg-[#11100E] cursor-pointer"
                >
                  <Film className="w-10 h-10 text-[#E2C799] mx-auto mb-3" />
                  <h4 className="font-serif text-sm text-[#F5F2EA] mb-1">
                    Drag & Drop 9:16 Video File (.mp4, .mov, .webm)
                  </h4>
                  <p className="text-xs text-[#8A8376] font-sans mb-4">
                    Supports high-bitrate 4K & 1080p vertical reels (Instagram, Shorts, TikTok) up to 500 MB
                  </p>
                  <label className="inline-block px-5 py-2.5 bg-[#E8DCC4] hover:bg-[#F5EFE3] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer">
                    Select 9:16 Video from Computer
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVideoFileSelected(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Staged Video Metadata Form */}
                {stagedVideoFile && (
                  <div className="p-4 bg-[#1C1A17] border border-[#38332B] space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2722] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#E2C799]">
                          Selected File:
                        </span>
                        <h4 className="font-mono text-sm text-[#F5F2EA] truncate">
                          {stagedVideoFile.name} ({(stagedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </h4>
                      </div>
                      {videoPoster && (
                        <div className="w-16 aspect-[9/16] bg-black border border-[#3A352C] overflow-hidden shrink-0">
                          <img
                            src={videoPoster}
                            alt="Snapshot poster"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                          Film Title
                        </label>
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="e.g. Canopy Shadows — Western Ghats"
                          className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2 text-xs focus:outline-none focus:border-[#E2C799]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                          Category / Chapter
                        </label>
                        <select
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value as Category)}
                          className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2 text-xs focus:outline-none focus:border-[#E2C799]"
                        >
                          {availableCategories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-[#777] font-mono mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={videoLocation}
                          onChange={(e) => setVideoLocation(e.target.value)}
                          className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#777] font-mono mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(e.target.value)}
                          className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-[#777] font-mono mb-1">
                          Camera & Gear EXIF
                        </label>
                        <input
                          type="text"
                          value={videoGear}
                          onChange={(e) => setVideoGear(e.target.value)}
                          className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A89F91] mb-1 font-mono">
                        Short Story / Film Description
                      </label>
                      <textarea
                        rows={2}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Context about the subject, behavior, or filming conditions..."
                        className="w-full bg-[#141311] border border-[#33302A] text-[#F5F2EA] px-3.5 py-2 text-xs focus:outline-none focus:border-[#E2C799] resize-none"
                      />
                    </div>

                    {/* Progress Bar (if uploading) */}
                    {isUploadingVideo && videoUploadProgress !== null && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-mono text-[#E2C799]">
                          <span>Uploading video to local server storage...</span>
                          <span>{videoProgressText}</span>
                        </div>
                        <div className="w-full h-2 bg-[#111] border border-[#333] overflow-hidden">
                          <div
                            className="h-full bg-[#E2C799] transition-all duration-200"
                            style={{ width: `${videoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isUploadingVideo}
                        onClick={handleCommitVideoUpload}
                        className="flex-1 py-3 bg-[#E2C799] hover:bg-[#F0DEBD] disabled:bg-[#444] disabled:text-[#777] text-[#0B0B0B] font-medium text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>
                          {isUploadingVideo
                            ? 'Uploading Video to Local Storage...'
                            : 'Upload & Add to Public Reel'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isUploadingVideo}
                        onClick={() => {
                          setStagedVideoFile(null);
                          setVideoPoster('');
                        }}
                        className="px-4 py-3 bg-[#24221E] hover:bg-[#333] text-xs font-mono text-[#A89F91] hover:text-[#FFF] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* List & Arrange Existing Videos */}
            <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-serif text-lg uppercase tracking-wider text-[#F5F2EA]">
                    Arrange & Delete Films ({videos.length})
                  </h3>
                  <p className="text-xs text-[#8A8376]">
                    Use the arrows to reorder the sequence in the public theater reel. Click the trash icon to remove a film.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {videos.map((vid, index) => {
                  const isLocal = vid.videoUrl && vid.videoUrl.startsWith('/uploads/');
                  return (
                    <div
                      key={vid.id}
                      className="bg-[#181714] border border-[#262420] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3D3A33] transition-colors"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 sm:w-20 aspect-[9/16] bg-black shrink-0 relative overflow-hidden border border-[#2E2B25] rounded-xs">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/80 px-1 py-0.2 text-[#DDD]">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.2 text-[9px] uppercase tracking-wider bg-[#222] text-[#E2C799] font-mono">
                              {vid.category}
                            </span>
                            <span className="text-[10px] font-mono text-[#666]">
                              Reel #{index + 1}
                            </span>
                            {isLocal ? (
                              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 font-mono">
                                Locally Present
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 bg-[#222] text-[#888] font-mono">
                                Curated Film
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm text-[#F5F2EA] truncate">{vid.title}</h4>
                          <p className="text-[11px] text-[#888] font-mono truncate">
                            {vid.location} {vid.gear && `· ${vid.gear}`}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions (Move Up, Move Down, Preview, Delete) */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        {/* Move Up */}
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveVideo(index, 'up')}
                          className="p-2 bg-[#22201D] hover:bg-[#333] disabled:opacity-30 text-[#A89F91] transition-colors cursor-pointer"
                          title="Move earlier in reel"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          disabled={index === videos.length - 1}
                          onClick={() => handleMoveVideo(index, 'down')}
                          className="p-2 bg-[#22201D] hover:bg-[#333] disabled:opacity-30 text-[#A89F91] transition-colors cursor-pointer"
                          title="Move later in reel"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Play Preview */}
                        <button
                          onClick={() => setPreviewVideoUrl(vid.videoUrl || null)}
                          className="p-2 bg-[#22201D] hover:bg-[#E2C799] hover:text-[#0B0B0B] text-[#A89F91] transition-colors cursor-pointer"
                          title="Preview Video"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          className="p-2 bg-[#22201D] hover:bg-red-900/60 hover:text-red-200 text-[#777] transition-colors cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Preview Lightbox Modal (9:16 Reel format) */}
            {previewVideoUrl && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
                <div className="w-full max-w-sm bg-[#12110F] border border-[#333] overflow-hidden rounded-xl shadow-2xl">
                  <div className="flex items-center justify-between p-3.5 bg-[#181715] border-b border-[#2B2925]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#E2C799]">
                      9:16 Reel Preview
                    </span>
                    <button
                      onClick={() => setPreviewVideoUrl(null)}
                      className="text-xs font-mono text-[#888] hover:text-white px-2 py-1 bg-[#222] cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="aspect-[9/16] bg-black relative">
                    <video
                      src={previewVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PHOTOGRAPHER PROFILE & PORTRAIT */}
        {activeTab === 'photographer' && (
          <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24221F] pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#E2C799] font-mono block mb-1">
                  Behind the Lens
                </span>
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                  Photographer Profile & Portrait
                </h2>
                <p className="text-xs text-[#9E9689] mt-1 font-sans">
                  Manage Vaisakh's portrait picture, biographical narrative, disciplines, and social presence.
                </p>
              </div>

              <button
                type="button"
                onClick={onExitAdmin}
                className="px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans text-[#E2C799] hover:text-[#0B0B0B] bg-[#1E1C19] hover:bg-[#E2C799] border border-[#3E3932] transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview in About Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Portrait Showcase & Upload */}
              <div className="lg:col-span-5 bg-[#181714] border border-[#2B2824] p-6 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4B291] font-mono block mb-2">
                    Current Portrait Picture
                  </span>
                  <div className="relative aspect-[3/4] bg-black/60 border border-[#33302A] overflow-hidden group">
                    <img
                      src={portraitPreview || photographerProfile.portrait}
                      alt={photographerProfile.name}
                      className="w-full h-full object-cover grayscale contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <p className="text-xs font-serif uppercase tracking-[0.2em] text-[#E8DCC4]">
                        {photographerProfile.name}
                      </p>
                      <p className="text-[10px] text-[#8C8476] uppercase tracking-widest">
                        Founder · {photographerProfile.brand}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Local Image File */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#C4B291] block font-mono">
                    Upload New Portrait Photo:
                  </span>
                  <input
                    ref={portraitInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setStagedPortraitFile(file);
                        const objUrl = URL.createObjectURL(file);
                        setPortraitPreview(objUrl);
                      }
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => portraitInputRef.current?.click()}
                    className="border border-dashed border-[#3D3A34] hover:border-[#E2C799] bg-[#0E0E0D] p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1C1A18] group-hover:bg-[#25221F] flex items-center justify-center text-[#E2C799] transition-colors">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-[#E8DCC4] tracking-wider">
                      {stagedPortraitFile ? stagedPortraitFile.name : 'Choose file or drag photo here'}
                    </span>
                    <span className="text-[10px] text-[#736E66]">
                      JPG, PNG, WEBP (saved directly to server)
                    </span>
                  </div>
                </div>

                {/* Quick select from gallery */}
                <div className="space-y-2 pt-2 border-t border-[#262420]">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C8476] block">
                    Or select from uploaded camera originals:
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { title: 'Vaisakh', url: '/images/photographer-vaisakh.jpg' },
                      { title: 'YSH_7289', url: '/images/macro/YSH_7289.jpg' },
                      { title: 'YSH_3295', url: '/images/uploaded_ysh_3295.jpg' },
                      { title: 'DSC_0099', url: '/images/macro/DSC_0099-7.jpg' },
                      { title: 'DSC_6917', url: '/images/macro/DSC_6917-topaz-sharpen-focus.jpg' },
                    ].map((shot) => (
                      <button
                        key={shot.title}
                        type="button"
                        onClick={() => {
                          setPortraitPreview(shot.url);
                          setStagedPortraitFile(null);
                        }}
                        className={`aspect-[3/4] bg-black border overflow-hidden transition-all cursor-pointer relative group ${
                          (portraitPreview || photographerProfile.portrait) === shot.url
                            ? 'border-[#E2C799] ring-1 ring-[#E2C799]'
                            : 'border-[#2D2A26] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={shot.url} alt={shot.title} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-[#A89F91] py-0.5 truncate text-center block font-mono">
                          {shot.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Bio, Story & Details Editor */}
              <div className="lg:col-span-7 bg-[#181714] border border-[#2B2824] p-6 space-y-5">
                <h3 className="text-sm uppercase tracking-[0.2em] text-[#E2C799] font-mono border-b border-[#262420] pb-2">
                  Photographer Narrative & Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                      Photographer Full Name
                    </label>
                    <input
                      type="text"
                      value={photographerProfile.name}
                      onChange={(e) =>
                        setPhotographerProfile({ ...photographerProfile, name: e.target.value })
                      }
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2.5 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                      Studio / Monograph Brand
                    </label>
                    <input
                      type="text"
                      value={photographerProfile.brand}
                      onChange={(e) =>
                        setPhotographerProfile({ ...photographerProfile, brand: e.target.value })
                      }
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2.5 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                      Professional Role
                    </label>
                    <input
                      type="text"
                      value={photographerProfile.role}
                      onChange={(e) =>
                        setPhotographerProfile({ ...photographerProfile, role: e.target.value })
                      }
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2.5 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                      Base Location
                    </label>
                    <input
                      type="text"
                      value={photographerProfile.location}
                      onChange={(e) =>
                        setPhotographerProfile({ ...photographerProfile, location: e.target.value })
                      }
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2.5 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                    Artistic Tagline
                  </label>
                  <input
                    type="text"
                    value={photographerProfile.tagline}
                    onChange={(e) =>
                      setPhotographerProfile({ ...photographerProfile, tagline: e.target.value })
                    }
                    className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2.5 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8C8476] mb-1.5 font-mono">
                    Biography / Artistic Narrative (One paragraph per line)
                  </label>
                  <textarea
                    rows={4}
                    value={photographerProfile.bio.join('\n\n')}
                    onChange={(e) => {
                      const paragraphs = e.target.value
                        .split('\n\n')
                        .map((p) => p.trim())
                        .filter(Boolean);
                      setPhotographerProfile({ ...photographerProfile, bio: paragraphs });
                    }}
                    className="w-full bg-[#0E0E0D] border border-[#33302A] p-3 text-xs text-[#F5F2EA] leading-relaxed focus:outline-none focus:border-[#E2C799]"
                  />
                </div>

                {/* Social Profiles */}
                <div className="pt-2 border-t border-[#262420] space-y-3">
                  <span className="text-xs uppercase tracking-wider text-[#C4B291] block font-mono">
                    Social Accounts & Contact
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-[#736E66] mb-1 font-mono">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={photographerProfile.socials.instagram}
                        onChange={(e) =>
                          setPhotographerProfile({
                            ...photographerProfile,
                            socials: {
                              ...photographerProfile.socials,
                              instagram: e.target.value,
                              instagramUrl: `https://instagram.com/${e.target.value.replace(/^@/, '')}`,
                            },
                          })
                        }
                        className="w-full bg-[#0E0E0D] border border-[#33302A] px-3 py-2 text-xs text-[#F5F2EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-[#736E66] mb-1 font-mono">
                        YouTube Channel
                      </label>
                      <input
                        type="text"
                        value={photographerProfile.socials.youtube}
                        onChange={(e) =>
                          setPhotographerProfile({
                            ...photographerProfile,
                            socials: {
                              ...photographerProfile.socials,
                              youtube: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#0E0E0D] border border-[#33302A] px-3 py-2 text-xs text-[#F5F2EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-[#736E66] mb-1 font-mono">
                        Direct Inquiries Email
                      </label>
                      <input
                        type="email"
                        value={photographerProfile.socials.email}
                        onChange={(e) =>
                          setPhotographerProfile({
                            ...photographerProfile,
                            socials: {
                              ...photographerProfile.socials,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#0E0E0D] border border-[#33302A] px-3 py-2 text-xs text-[#F5F2EA]"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="pt-4 flex items-center justify-between">
                  <div className="text-[11px] text-[#736E66]">
                    Updates take effect live across the monograph.
                  </div>

                  <button
                    type="button"
                    disabled={isSavingPhotographer}
                    onClick={async () => {
                      setIsSavingPhotographer(true);
                      try {
                        let finalPortrait = photographerProfile.portrait;
                        if (stagedPortraitFile) {
                          finalPortrait = await uploadPortraitImage(stagedPortraitFile);
                        } else if (portraitPreview) {
                          finalPortrait = portraitPreview;
                        }

                        const updated: PhotographerProfile = {
                          ...photographerProfile,
                          portrait: finalPortrait,
                        };

                        setPhotographerProfile(updated);
                        if (onUpdatePhotographer) {
                          onUpdatePhotographer(updated);
                        }
                        await persistPhotographerToServer(updated);

                        setStatusMessage({
                          type: 'success',
                          text: 'Photographer profile and portrait updated successfully!',
                        });
                        setStagedPortraitFile(null);
                        setPortraitPreview(null);
                      } catch (err: any) {
                        console.error('Error saving photographer profile:', err);
                        setStatusMessage({
                          type: 'error',
                          text: `Failed to update profile: ${err.message}`,
                        });
                      } finally {
                        setIsSavingPhotographer(false);
                      }
                    }}
                    className="px-6 py-2.5 bg-[#E8DCC4] hover:bg-[#F5EFE3] text-[#0B0B0B] text-xs uppercase tracking-[0.25em] font-medium transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-40"
                  >
                    {isSavingPhotographer ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Profile & Portrait</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & SETTINGS */}
        {activeTab === 'export' && (
          <div className="bg-[#12110F] border border-[#2B2925] p-6 sm:p-8 space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#E2C799] font-mono block mb-1">
                Data Redundancy & Persistence
              </span>
              <h2 className="text-xl sm:text-2xl font-serif tracking-[0.1em] uppercase text-[#F5F2EA]">
                Portfolio Persistence & Source Backup
              </h2>
              <p className="text-xs text-[#9E9689] mt-1 font-sans">
                All photos and videos are served live from the server backend. You can also export full backups or restore factory state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Admin Direct Link */}
              <div className="bg-[#181714] border border-[#2B2824] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E2C799] font-mono">
                  <ExternalLink className="w-4 h-4" />
                  <span>Exclusive Admin Link</span>
                </div>
                <p className="text-xs text-[#8E877C]">
                  Keep this link bookmarked. It gives you direct access to this studio from any computer.
                </p>
                <div className="p-2.5 bg-[#0B0B0B] border border-[#33302A] font-mono text-[11px] text-[#C4B291] break-all select-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/admin` : '/admin'}
                </div>
                <button
                  onClick={handleCopyAdminLink}
                  className="w-full py-2 bg-[#22201D] hover:bg-[#333] text-xs font-mono uppercase tracking-wider text-[#E8DCC4] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied to Clipboard' : 'Copy Admin Portal URL'}</span>
                </button>
              </div>

              {/* Card 2: JSON Backup */}
              <div className="bg-[#181714] border border-[#2B2824] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E2C799] font-mono">
                  <Download className="w-4 h-4" />
                  <span>JSON Database Backup</span>
                </div>
                <p className="text-xs text-[#8E877C]">
                  Download the current catalog of {photos.length} photos with complete camera EXIF, stories, and titles.
                </p>
                <div className="text-[11px] text-[#666] font-mono">
                  Includes all custom metadata and server paths.
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-2 bg-[#22201D] hover:bg-[#333] text-xs font-mono uppercase tracking-wider text-[#E8DCC4] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download photos.json</span>
                </button>
              </div>

              {/* Card 3: Factory Reset */}
              <div className="bg-[#181714] border border-red-950/40 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400 font-mono">
                  <RefreshCw className="w-4 h-4" />
                  <span>Factory Reset</span>
                </div>
                <p className="text-xs text-[#8E877C]">
                  Revert all photos back to the initial curated portfolio. Any custom uploaded photos will be removed.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-mono uppercase tracking-wider text-red-200 transition-colors cursor-pointer"
                >
                  Reset to Initial Curated Monograph
                </button>
              </div>

              {/* Card 4: View Live Portfolio */}
              <div className="bg-[#181714] border border-[#2B2824] p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E2C799] font-mono">
                  <Eye className="w-4 h-4" />
                  <span>Public Visitor View</span>
                </div>
                <p className="text-xs text-[#8E877C]">
                  See exactly what your visitors and clients see when viewing the physical interactive monograph.
                </p>
                <button
                  onClick={onExitAdmin}
                  className="w-full py-2 bg-[#E2C799] hover:bg-[#F0DEBD] text-[#0B0B0B] text-xs font-medium uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  View Live Monograph Spreads
                </button>
              </div>

              {/* Card 5: GitHub Repository Sync (https://github.com/yshyp) */}
              <div className="md:col-span-2 bg-[#181714] border border-[#3D382F] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2722] pb-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#E2C799] font-mono">
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub Repository Sync (yshyp)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#25221D] text-emerald-400 border border-emerald-800/50">
                    Git Initialized (Branch: main)
                  </span>
                </div>

                <p className="text-xs text-[#A89F91] leading-relaxed">
                  Your complete codebase (56 files including all 9:16 vertical reels, macro photo plates, cinematic motion styling, and full-stack backend) is committed and ready on branch <strong className="text-[#F5F2EA]">main</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C8476] mb-1 font-mono">
                      Target Repository Name or URL
                    </label>
                    <input
                      type="text"
                      value={gitRepoName}
                      onChange={(e) => setGitRepoName(e.target.value)}
                      placeholder="e.g. my_gallery or frames-and-visuals"
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2 text-xs text-[#F5F2EA] font-mono focus:outline-none focus:border-[#E2C799]"
                    />
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-[#666] font-mono">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setGitRepoName('my_gallery')}
                        className={`text-[9px] px-2 py-0.5 font-mono border transition-colors cursor-pointer ${
                          gitRepoName === 'my_gallery'
                            ? 'bg-[#E2C799] text-black border-[#E2C799]'
                            : 'bg-[#1D1B17] text-[#C4B291] border-[#3D382F] hover:border-[#E2C799]'
                        }`}
                      >
                        my_gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setGitRepoName('frames-and-visuals')}
                        className={`text-[9px] px-2 py-0.5 font-mono border transition-colors cursor-pointer ${
                          gitRepoName === 'frames-and-visuals'
                            ? 'bg-[#E2C799] text-black border-[#E2C799]'
                            : 'bg-[#1D1B17] text-[#C4B291] border-[#3D382F] hover:border-[#E2C799]'
                        }`}
                      >
                        frames-and-visuals
                      </button>
                    </div>
                    <span className="text-[9px] text-[#666] font-mono mt-1 block">
                      Resolves to: https://github.com/yshyp/{gitRepoName || '<repo-name>'}.git
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#8C8476] mb-1 font-mono">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <input
                      type="password"
                      value={gitToken}
                      onChange={(e) => setGitToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Optional for public pushes)"
                      className="w-full bg-[#0E0E0D] border border-[#33302A] px-3.5 py-2 text-xs text-[#F5F2EA] font-mono focus:outline-none focus:border-[#E2C799]"
                    />
                    <span className="text-[9px] text-[#666] font-mono mt-1 block">
                      From GitHub Settings → Developer settings → Personal access tokens
                    </span>
                  </div>
                </div>

                {gitFeedback && (
                  <div
                    className={`p-3 text-xs font-mono ${
                      gitFeedback.type === 'success'
                        ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                        : 'bg-red-950/40 border border-red-800/60 text-red-300'
                    }`}
                  >
                    {gitFeedback.message}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isPushingGit}
                    onClick={handlePushToGithub}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#E8DCC4] hover:bg-[#F5EFE3] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {isPushingGit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Pushing to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Push to github.com/yshyp</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-[#777] font-mono">
                    Or run directly in terminal:{' '}
                    <code className="text-[#C4B291] bg-black px-1.5 py-0.5 border border-[#333]">
                      git remote add origin https://github.com/yshyp/{gitRepoName}.git &amp;&amp; git push -u origin main
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
