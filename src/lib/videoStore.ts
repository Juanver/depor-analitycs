/**
 * Almacén en memoria y sesión para archivos de video locales (.mp4).
 * Permite reproducir videos subidos por el usuario en /analisis/[id]
 * mediante URL.createObjectURL(file) sin perder la referencia en navegación SPA,
 * además de extraer y preservar metadatos reales (duración, resolución).
 */

export interface VideoMetadata {
  durationSeconds: number;
  width: number;
  height: number;
}

interface LocalVideoEntry {
  file: File | null;
  objectUrl: string | null;
  fileName: string;
  fileSizeMb: number;
  durationSeconds: number;
  width: number;
  height: number;
}

let inMemoryVideo: LocalVideoEntry = {
  file: null,
  objectUrl: null,
  fileName: '',
  fileSizeMb: 0,
  durationSeconds: 0,
  width: 1920,
  height: 1080,
};

/**
 * Extrae duración real (en segundos) y dimensiones de un video local mediante <video preload="metadata">.
 */
export function extractVideoMetadata(objectUrl: string): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve({ durationSeconds: 0, width: 1920, height: 1080 });
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;

    const cleanup = () => {
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      cleanup();
      resolve({ durationSeconds: duration, width, height });
    };

    video.onerror = () => {
      cleanup();
      resolve({ durationSeconds: 0, width: 1920, height: 1080 });
    };

    video.src = objectUrl;
  });
}

export const videoStore = {
  setVideo(file: File): string {
    if (inMemoryVideo.objectUrl) {
      try {
        URL.revokeObjectURL(inMemoryVideo.objectUrl);
      } catch {}
    }

    const objectUrl = URL.createObjectURL(file);
    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

    inMemoryVideo = {
      file,
      objectUrl,
      fileName: file.name,
      fileSizeMb,
      durationSeconds: 0,
      width: 1920,
      height: 1080,
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('depor_local_video_url', objectUrl);
        sessionStorage.setItem('depor_local_video_name', file.name);
        sessionStorage.setItem('depor_local_video_size', fileSizeMb.toString());
        sessionStorage.removeItem('depor_local_video_duration');
      } catch (e) {
        console.warn('No se pudo guardar la sesión de video en sessionStorage:', e);
      }
    }

    return objectUrl;
  },

  setMetadata(meta: VideoMetadata) {
    inMemoryVideo.durationSeconds = meta.durationSeconds;
    inMemoryVideo.width = meta.width;
    inMemoryVideo.height = meta.height;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('depor_local_video_duration', meta.durationSeconds.toString());
        sessionStorage.setItem('depor_local_video_width', meta.width.toString());
        sessionStorage.setItem('depor_local_video_height', meta.height.toString());
      } catch {}
    }
  },

  getMetadata(): VideoMetadata {
    if (inMemoryVideo.durationSeconds > 0) {
      return {
        durationSeconds: inMemoryVideo.durationSeconds,
        width: inMemoryVideo.width,
        height: inMemoryVideo.height,
      };
    }

    if (typeof window !== 'undefined') {
      const dur = Number(sessionStorage.getItem('depor_local_video_duration') || '0');
      const w = Number(sessionStorage.getItem('depor_local_video_width') || '1920');
      const h = Number(sessionStorage.getItem('depor_local_video_height') || '1080');
      return {
        durationSeconds: Number.isFinite(dur) ? dur : 0,
        width: Number.isFinite(w) && w > 0 ? w : 1920,
        height: Number.isFinite(h) && h > 0 ? h : 1080,
      };
    }

    return { durationSeconds: 0, width: 1920, height: 1080 };
  },

  getVideoUrl(): string | null {
    if (inMemoryVideo.objectUrl) {
      return inMemoryVideo.objectUrl;
    }

    if (typeof window !== 'undefined') {
      const storedUrl = sessionStorage.getItem('depor_local_video_url');
      if (storedUrl) return storedUrl;
    }

    return null;
  },

  getVideoFile(): File | null {
    return inMemoryVideo.file;
  },

  getVideoName(): string {
    if (inMemoryVideo.fileName) return inMemoryVideo.fileName;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('depor_local_video_name') || 'video-local.mp4';
    }
    return 'video-local.mp4';
  },

  clear() {
    if (inMemoryVideo.objectUrl) {
      try {
        URL.revokeObjectURL(inMemoryVideo.objectUrl);
      } catch {}
    }
    inMemoryVideo = {
      file: null,
      objectUrl: null,
      fileName: '',
      fileSizeMb: 0,
      durationSeconds: 0,
      width: 1920,
      height: 1080,
    };
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('depor_local_video_url');
      sessionStorage.removeItem('depor_local_video_name');
      sessionStorage.removeItem('depor_local_video_size');
      sessionStorage.removeItem('depor_local_video_duration');
      sessionStorage.removeItem('depor_local_video_width');
      sessionStorage.removeItem('depor_local_video_height');
    }
  },
};
