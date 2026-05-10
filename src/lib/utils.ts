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
    // Return direct thumbnail link (more reliable than uc?export=view)
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  
  return url;
}
