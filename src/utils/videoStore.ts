import { VideoStory } from '../types/portfolio';
import { INITIAL_VIDEOS } from '../data/videos';

const STORAGE_KEY = 'ysh_portfolio_videos_v1';

export function getStoredVideos(): VideoStory[] {
  if (typeof window === 'undefined') return INITIAL_VIDEOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_VIDEOS;
}

export function saveStoredVideos(videos: VideoStory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (err) {
    console.warn('Failed to cache videos in localStorage', err);
  }
}

export async function fetchServerVideos(): Promise<VideoStory[] | null> {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
      saveStoredVideos(data.videos);
      return data.videos;
    }
  } catch (err) {
    console.warn('Backend server videos not reachable, using local storage cache', err);
  }
  return null;
}

export async function persistVideosToServer(videos: VideoStory[]): Promise<boolean> {
  saveStoredVideos(videos);
  try {
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos }),
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to persist videos to server', err);
    return false;
  }
}

export async function deleteVideoFromServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.warn('Failed to delete video from server', err);
    return false;
  }
}

/**
 * Upload local video file to server with real-time percentage progress
 */
export function uploadLocalVideoFile(
  file: File,
  onProgress?: (percent: number, loadedBytes: number, totalBytes: number) => void
): Promise<{ success: boolean; url: string; filename: string; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('video', file, file.name);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent, e.loaded, e.total);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            resolve({
              success: true,
              url: res.url,
              filename: res.filename || file.name,
              sizeBytes: res.sizeBytes || file.size,
            });
            return;
          }
        } catch (e) {
          reject(new Error('Invalid server JSON response'));
          return;
        }
      }
      reject(new Error(`Video upload failed with status ${xhr.status}`));
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during video upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Video upload cancelled'));
    });

    xhr.open('POST', '/api/upload-video');
    xhr.send(formData);
  });
}

/**
 * Extract snapshot frame from a video file to automatically use as a high-quality poster thumbnail
 */
export function captureVideoPoster(file: File): Promise<{ posterDataUrl: string; durationSec: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Seek to 1 second or 25% to avoid black first frames
      const seekTime = Math.min(1.0, video.duration / 4);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const posterDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(objectUrl);
          resolve({
            posterDataUrl,
            durationSec: video.duration || 0,
          });
          return;
        }
      } catch {
        // fallback
      }
      URL.revokeObjectURL(objectUrl);
      resolve({ posterDataUrl: '', durationSec: video.duration || 0 });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ posterDataUrl: '', durationSec: 0 });
    };
  });
}
