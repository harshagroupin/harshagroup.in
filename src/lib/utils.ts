import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  
  // Check for Google Drive links (including malformed uc?export=view ones)
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?export=view&id=|uc\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Return direct web content link (highly reliable for Google Drive hosting)
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  
  return url;
}

export function resolveCmsImageUrl(url: string | null | undefined): string | null {
  if (!url || url.startsWith("DUMMY_")) return null;
  return formatImageUrl(url);
}

export function getYoutubeEmbed(url: string | undefined | null, isBackground = false): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!match) return null;
  const videoId = match[1];
  
  if (isBackground) {
    // Optimized for background hero videos (no controls, muted, looping, autoplaying)
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1&iv_load_policy=3`;
  }
  
  return `https://www.youtube.com/embed/${videoId}?playsinline=1`;
}
