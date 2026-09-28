import { PhotographerProfile } from '../types/portfolio';
import { PHOTOGRAPHER_INFO } from '../data/photos';

const PHOTOGRAPHER_STORAGE_KEY = 'ysh_photographer_profile_v2';

export const DEFAULT_PHOTOGRAPHER: PhotographerProfile = {
  name: PHOTOGRAPHER_INFO.name,
  brand: PHOTOGRAPHER_INFO.brand,
  role: PHOTOGRAPHER_INFO.role,
  tagline: PHOTOGRAPHER_INFO.tagline,
  categories: [...PHOTOGRAPHER_INFO.categories],
  location: PHOTOGRAPHER_INFO.location,
  bio: [...PHOTOGRAPHER_INFO.bio],
  socials: { ...PHOTOGRAPHER_INFO.socials },
  portrait: PHOTOGRAPHER_INFO.portrait,
};

/**
 * Get photographer profile from localStorage with fallback to default
 */
export function getStoredPhotographer(): PhotographerProfile {
  if (typeof window === 'undefined') return DEFAULT_PHOTOGRAPHER;
  try {
    const raw = localStorage.getItem(PHOTOGRAPHER_STORAGE_KEY);
    if (!raw) return DEFAULT_PHOTOGRAPHER;
    const parsed = JSON.parse(raw);
    const portrait = (parsed.portrait && !parsed.portrait.startsWith('data:image/svg'))
      ? parsed.portrait
      : DEFAULT_PHOTOGRAPHER.portrait;
    return {
      ...DEFAULT_PHOTOGRAPHER,
      ...parsed,
      portrait,
      socials: {
        ...DEFAULT_PHOTOGRAPHER.socials,
        ...(parsed.socials || {}),
      },
    };
  } catch (err) {
    console.error('Failed reading stored photographer profile:', err);
    return DEFAULT_PHOTOGRAPHER;
  }
}

/**
 * Save photographer profile to localStorage
 */
export function saveStoredPhotographer(profile: PhotographerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PHOTOGRAPHER_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed writing stored photographer profile:', err);
  }
}

/**
 * Fetch photographer profile from backend server
 */
export async function fetchServerPhotographer(): Promise<PhotographerProfile | null> {
  try {
    const res = await fetch('/api/photographer');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.photographer) {
      saveStoredPhotographer(data.photographer);
      return data.photographer;
    }
    return null;
  } catch (err) {
    console.warn('Backend photographer sync unavailable, using local cache:', err);
    return null;
  }
}

/**
 * Persist photographer profile to backend server
 */
export async function persistPhotographerToServer(profile: PhotographerProfile): Promise<boolean> {
  try {
    saveStoredPhotographer(profile);
    const res = await fetch('/api/photographer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photographer: profile }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to persist photographer profile to server:', err);
    return false;
  }
}

/**
 * Upload a portrait image to server and update photographer profile
 */
export async function uploadPortraitImage(fileOrBase64: File | string): Promise<string> {
  if (typeof fileOrBase64 === 'string') {
    // Base64 data URL
    const res = await fetch('/api/photographer/portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: fileOrBase64,
        filename: `vaisakh_portrait_${Date.now()}.jpg`,
      }),
    });
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    throw new Error(data.error || 'Failed to upload portrait');
  } else {
    // Form data file upload
    const formData = new FormData();
    formData.append('portrait', fileOrBase64);

    const res = await fetch('/api/photographer/portrait', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    throw new Error(data.error || 'Failed to upload portrait file');
  }
}
