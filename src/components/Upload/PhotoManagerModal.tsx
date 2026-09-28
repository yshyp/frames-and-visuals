import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Check, 
  Image as ImageIcon, 
  Camera, 
  MapPin, 
  Tag, 
  Link2, 
  Sparkles, 
  FolderOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Photo, Category } from '../../types/portfolio';

interface StagedPhoto {
  id: string;
  dataUrl: string;
  title: string;
  category: Category;
  location: string;
  camera: string;
  lens: string;
  aperture: string;
  story: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
}

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  onUpdatePhotos: (photos: Photo[]) => void;
  onResetPhotos: () => void;
  initialStagedFile?: File | null;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  photos,
  onUpdatePhotos,
  onResetPhotos,
  initialStagedFile = null,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'code-guide'>('upload');
  
  // Staged queue for single or batch uploads
  const [stagedQueue, setStagedQueue] = useState<StagedPhoto[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<Category>('Macro');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  // Dynamic categories list
  const availableCategories = React.useMemo(() => {
    const base = ['Wildlife', 'Macro', 'Nature', 'Travel', 'Visual Stories'];
    const custom = Array.from(new Set(photos.map(p => p.category))).filter(c => !base.includes(c));
    return [...base, ...custom];
  }, [photos]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to format clean title from filename
  const cleanFilenameToTitle = (filename: string): string => {
    const withoutExt = filename.replace(/\.[^/.]+$/, '');
    return withoutExt
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  // Process files
  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          let ratio: 'landscape' | 'portrait' | 'square' = 'landscape';
          if (img.width > img.height * 1.15) {
            ratio = 'landscape';
          } else if (img.height > img.width * 1.15) {
            ratio = 'portrait';
          } else {
            ratio = 'square';
          }

          const newStaged: StagedPhoto = {
            id: `staged-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            dataUrl,
            title: cleanFilenameToTitle(file.name) || 'Untitled Frame',
            category: defaultCategory,
            location: 'Kerala, India',
            camera: 'Nikon Z6III',
            lens: '',
            aperture: '',
            story: '',
            aspectRatio: ratio,
          };

          setStagedQueue(prev => [...prev, newStaged]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // If passed an initial dropped file on open
  useEffect(() => {
    if (initialStagedFile) {
      processFiles([initialStagedFile]);
    }
  }, [initialStagedFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let ratio: 'landscape' | 'portrait' | 'square' = 'landscape';
      if (img.width > img.height * 1.15) {
        ratio = 'landscape';
      } else if (img.height > img.width * 1.15) {
        ratio = 'portrait';
      } else {
        ratio = 'square';
      }

      const newStaged: StagedPhoto = {
        id: `staged-url-${Date.now()}`,
        dataUrl: trimmed,
        title: 'New Visual Story',
        category: defaultCategory,
        location: 'Kerala, India',
        camera: 'Nikon Z6III',
        lens: '',
        aperture: '',
        story: '',
        aspectRatio: ratio,
      };

      setStagedQueue(prev => [...prev, newStaged]);
      setUrlInput('');
    };
    img.onerror = () => {
      setUrlError('Could not load image from URL. Please ensure it is a direct image link.');
    };
    img.src = trimmed;
  };

  const updateStagedItem = (id: string, updates: Partial<StagedPhoto>) => {
    setStagedQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeStagedItem = (id: string) => {
    setStagedQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleCommitAllToAlbum = () => {
    if (stagedQueue.length === 0) return;

    const newPhotos: Photo[] = stagedQueue.map((item) => ({
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: item.title || 'Untitled Photograph',
      category: item.category,
      image: item.dataUrl,
      location: item.location || 'Kerala, India',
      camera: item.camera || undefined,
      lens: item.lens || undefined,
      aperture: item.aperture || undefined,
      story: item.story || undefined,
      aspectRatio: item.aspectRatio,
      featured: true,
    }));

    onUpdatePhotos([...newPhotos, ...photos]);
    setAddedCount(newPhotos.length);
    setIsSuccess(true);
    setStagedQueue([]);

    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    onUpdatePhotos(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#121212] border border-[#2b2926] shadow-2xl rounded-xs flex flex-col max-h-[92vh] overflow-hidden text-[#F5F2EA]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#181613]">
              <ImageIcon className="w-4 h-4 text-[#E2C799]" />
            </div>
            <div>
              <h2 className="text-sm font-serif uppercase tracking-[0.2em] text-[#F5F2EA]">
                Add Photographs to Album
              </h2>
              <p className="text-[10px] text-[#8C8476] font-sans">
                Physical Monograph Live Editor · Frames & Visuals by Ysh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-[#fff] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="flex items-center gap-2 px-6 pt-2 border-b border-[#222] bg-[#0E0E0E] text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 border-b-2 font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-[#E2C799] text-[#E8DCC4] font-medium'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#E2C799]" />
            <span>Add / Upload Photos</span>
            {stagedQueue.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-[#E2C799] text-[#0B0B0B] font-bold rounded-full">
                {stagedQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2.5 border-b-2 font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'border-[#E2C799] text-[#E8DCC4] font-medium'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Album Spreads</span>
            <span className="text-[10px] font-mono text-[#666]">({photos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('code-guide')}
            className={`px-4 py-2.5 border-b-2 font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer ${
              activeTab === 'code-guide'
                ? 'border-[#E2C799] text-[#E8DCC4] font-medium'
                : 'border-transparent text-[#888] hover:text-[#CCC]'
            }`}
          >
            <span>Directory Setup Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'upload' && (
            <div>
              {/* Success Banner */}
              {isSuccess && (
                <div className="mb-6 p-4 bg-[#18231c] border border-[#2d4d38] rounded-xs flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-[#2d4d38] flex items-center justify-center text-[#A8E6CF] shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif uppercase tracking-widest text-[#E8DCC4]">
                      {addedCount} {addedCount === 1 ? 'Photograph' : 'Photographs'} Successfully Added to Album!
                    </h4>
                    <p className="text-[11px] text-[#A8E6CF]/90">
                      The book pages and physical page turns have been dynamically regenerated with your new imagery.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Drop Zone & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Drag and Drop Box (spans 2 cols on desktop) */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="md:col-span-2 border-2 border-dashed border-[#333] hover:border-[#E2C799]/70 bg-[#161514] hover:bg-[#1a1918] p-6 text-center cursor-pointer transition-all rounded-xs flex flex-col items-center justify-center min-h-[160px] group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#242220] group-hover:bg-[#E2C799]/20 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-5 h-5 text-[#E2C799]" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#F5F2EA] font-sans font-medium">
                    Drag & Drop Your Photographs Here
                  </span>
                  <p className="text-[11px] text-[#999] mt-1 max-w-sm">
                    Select single or multiple photography files (JPEG, PNG, WebP, AVIF). All will be turned into physical album spreads.
                  </p>
                  <span className="mt-3 px-3 py-1 bg-[#262422] group-hover:bg-[#333] text-[10px] text-[#E2C799] uppercase tracking-wider rounded-xs transition-colors">
                    Browse Local Files
                  </span>
                </div>

                {/* Right: Direct URL & Default Category */}
                <div className="bg-[#161514] border border-[#2b2926] p-4 rounded-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#8C8476] font-sans font-medium">
                        Target Album / Chapter
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCreatingNewCategory(!isCreatingNewCategory)}
                        className="text-[9px] uppercase tracking-wider text-[#E2C799] hover:underline cursor-pointer"
                      >
                        {isCreatingNewCategory ? 'Select Existing' : '+ New Album'}
                      </button>
                    </div>

                    {isCreatingNewCategory ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="e.g. Birds, Monsoon..."
                          className="flex-1 bg-[#1e1c1a] border border-[#3a3733] text-[#F5F2EA] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E2C799]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = customCategoryInput.trim();
                            if (trimmed) {
                              setDefaultCategory(trimmed);
                              setIsCreatingNewCategory(false);
                              setCustomCategoryInput('');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-[#E2C799] text-[#0B0B0B] text-xs font-sans uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          Set
                        </button>
                      </div>
                    ) : (
                      <select
                        value={defaultCategory}
                        onChange={(e) => setDefaultCategory(e.target.value as Category)}
                        className="w-full bg-[#1e1c1a] border border-[#3a3733] text-[#F5F2EA] px-3 py-2 text-xs focus:outline-none focus:border-[#E2C799]"
                      >
                        {availableCategories.map((cat, idx) => (
                          <option key={cat} value={cat}>
                            {String(idx + 1).padStart(2, '0')} — {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <form onSubmit={handleAddFromUrl} className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#8C8476] font-sans font-medium">
                      Or Add by Direct Image URL
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://.../photo.jpg"
                        className="flex-1 bg-[#1e1c1a] border border-[#3a3733] text-[#F5F2EA] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E2C799]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#2a2825] hover:bg-[#E2C799] hover:text-[#0B0B0B] text-xs font-sans uppercase tracking-wider text-[#E2C799] transition-colors cursor-pointer shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                    {urlError && (
                      <p className="text-[10px] text-[#E57373] mt-1">{urlError}</p>
                    )}
                  </form>
                </div>
              </div>

              {/* Staged Queue Section */}
              {stagedQueue.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#262421]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-serif uppercase tracking-[0.2em] text-[#E8DCC4]">
                        Ready to Add to Album ({stagedQueue.length} {stagedQueue.length === 1 ? 'Photograph' : 'Photographs'})
                      </h3>
                      <p className="text-[10px] text-[#7E776D]">
                        Review or customize title & category before adding into the monograph.
                      </p>
                    </div>
                    <button
                      onClick={handleCommitAllToAlbum}
                      className="px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-sans font-medium bg-[#E8DCC4] text-[#0B0B0B] hover:bg-[#F5EFE3] transition-all cursor-pointer flex items-center gap-2 shadow-lg rounded-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Confirm & Add to Album</span>
                    </button>
                  </div>

                  {/* Staged Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                    {stagedQueue.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#181715] border border-[#2b2926] rounded-xs flex gap-3 relative group"
                      >
                        <div className="w-20 h-20 bg-black/60 shrink-0 relative overflow-hidden rounded-xs border border-[#333]">
                          <img
                            src={item.dataUrl}
                            alt="Staged"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 text-[8px] uppercase tracking-wider bg-black/80 px-1 py-0.5 text-[#A89F91]">
                            {item.aspectRatio}
                          </span>
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateStagedItem(item.id, { title: e.target.value })}
                            placeholder="Title..."
                            className="w-full bg-[#111] border border-[#333] px-2 py-1 text-xs text-[#F5F2EA] focus:outline-none focus:border-[#E2C799]"
                          />
                          <div className="flex gap-2">
                            <select
                              value={item.category}
                              onChange={(e) => updateStagedItem(item.id, { category: e.target.value as Category })}
                              className="flex-1 bg-[#111] border border-[#333] px-1.5 py-1 text-[11px] text-[#A89F91] focus:outline-none"
                            >
                              {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => updateStagedItem(item.id, { location: e.target.value })}
                              placeholder="Location"
                              className="w-28 bg-[#111] border border-[#333] px-2 py-1 text-[11px] text-[#A89F91] focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => removeStagedItem(item.id)}
                          className="text-[#666] hover:text-[#E57373] p-1 self-start transition-colors cursor-pointer"
                          title="Discard this photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleCommitAllToAlbum}
                      className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-[0.2em] font-sans font-medium bg-[#E8DCC4] text-[#0B0B0B] hover:bg-[#F5EFE3] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg rounded-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add All {stagedQueue.length} to Album</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222]">
                <div>
                  <span className="text-xs font-serif uppercase tracking-widest text-[#E8DCC4]">
                    Curated Collection
                  </span>
                  <span className="ml-2 text-xs text-[#888]">
                    ({photos.length} Photographs in Album)
                  </span>
                </div>
                <button
                  onClick={onResetPhotos}
                  className="flex items-center gap-1.5 text-xs text-[#E57373] hover:text-[#EF5350] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Original Curated Monograph</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3 bg-[#161615] border border-[#262421] flex items-center justify-between gap-3 rounded-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xs shrink-0 bg-black/40 border border-[#2b2926]"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-serif uppercase tracking-wider text-[#F5F2EA] truncate">
                          {photo.title}
                        </p>
                        <p className="text-[10px] text-[#8C8476] truncate font-sans">
                          {photo.category} · {photo.location}
                        </p>
                        <span className="text-[9px] font-mono text-[#666]">
                          Aspect: {photo.aspectRatio || 'original'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 text-[#777] hover:text-[#EF5350] transition-colors cursor-pointer shrink-0"
                      title="Remove from album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code-guide' && (
            <div className="space-y-4 text-xs text-[#B0A89C] leading-relaxed">
              <h3 className="font-serif text-sm uppercase tracking-widest text-[#E8DCC4]">
                Directory Organization for Uploaded Files
              </h3>
              <p>
                As requested in your brief, the photos structure supports direct folder placement at:
              </p>
              <pre className="p-3 bg-[#0a0a0a] border border-[#222] font-mono text-[11px] text-[#A8E6CF] overflow-x-auto">
{`/public/images/
    /wildlife/      (e.g., 01.webp, leopard.jpg)
    /macro/         (e.g., dewdrop.webp)
    /nature/        (e.g., munnar_hills.webp)
    /travel/        (e.g., alleppey_backwaters.webp)
    /stories/       (e.g., monsoon.webp)`}
              </pre>
              <p>
                You can also configure them directly in <code className="text-[#E2C799]">src/data/photos.ts</code> using the structured array format:
              </p>
              <pre className="p-3 bg-[#0a0a0a] border border-[#222] font-mono text-[11px] text-[#E8DCC4] overflow-x-auto">
{`{
  id: "wl-01",
  title: "Into the Wild",
  category: "Wildlife",
  image: "/images/wildlife/01.webp",
  location: "Kerala, India",
  camera: "Nikon Z6III",
  lens: "150-600mm",
  aspectRatio: "landscape"
}`}
              </pre>
              <p className="text-[11px] text-[#888]">
                Any photos uploaded through this UI are also saved instantly into browser storage and seamlessly integrated with the physical page turn spreads!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
