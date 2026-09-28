import { Photo } from '../types/portfolio';
import { INITIAL_PHOTOS } from '../data/photos';

const STORAGE_KEY = 'ysh_portfolio_custom_photos_v3';
const LEGACY_STORAGE_KEY = 'ysh_portfolio_custom_photos_v2';

export function getStoredPhotos(): Photo[] {
  if (typeof window === 'undefined') return INITIAL_PHOTOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Migrate any custom uploaded photos from v1 while adopting the new Macro collection
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed: Photo[] = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        const userCustom = legacyParsed.filter(
          (p) =>
            !p.id.startsWith('wl-') &&
            !p.id.startsWith('mc-') &&
            !p.id.startsWith('nt-') &&
            !p.id.startsWith('tr-') &&
            !p.id.startsWith('vs-')
        );
        if (userCustom.length > 0) {
          const merged = [...userCustom, ...INITIAL_PHOTOS];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    }
  } catch {
    // Return fallback
  }
  return INITIAL_PHOTOS;
}

export function saveStoredPhotos(photos: Photo[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.warn('Storage quota reached or error storing photos', err);
  }
}

export function resetToInitialPhotos(): Photo[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  return INITIAL_PHOTOS;
}

/**
 * Fetch photos from permanent backend server.
 * If server has saved photos, updates localStorage and returns them.
 */
export async function fetchServerPhotos(): Promise<Photo[] | null> {
  try {
    const res = await fetch('/api/photos');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.photos) && data.photos.length > 0) {
      saveStoredPhotos(data.photos);
      return data.photos;
    }
  } catch (err) {
    console.warn('Backend server photos not reachable, using local storage cache', err);
  }
  return null;
}

/**
 * Save photos permanently to backend server and local cache
 */
export async function persistPhotosToServer(photos: Photo[]): Promise<boolean> {
  saveStoredPhotos(photos);
  try {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos }),
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to persist photos to backend server', err);
    return false;
  }
}

/**
 * Upload an original image file to the server's permanent disk
 */
export async function uploadImageToServer(
  file: File,
  targetPath?: string
): Promise<{ success: boolean; url: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            dataUrl,
            targetPath,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            resolve({
              success: true,
              url: data.url,
              filename: data.filename || file.name,
            });
            return;
          }
        }
        // Fallback: if server not running (or error), resolve with dataUrl so client still works
        resolve({
          success: true,
          url: dataUrl,
          filename: file.name,
        });
      } catch {
        // Fallback to data URL
        resolve({
          success: true,
          url: dataUrl,
          filename: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  });
}
