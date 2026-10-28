/**
 * Utility to reliably resolve any image URL in the Admin panel.
 * Handles:
 * - data: (base64 images from client-side compression)
 * - http / https (external or absolute URLs)
 * - /uploads/... (backend-stored images)
 * - /galery/... or /... (frontend public assets)
 */

const FRONTEND_ORIGIN = 'https://rayakonstruksijaya.vercel.app';
const BACKEND_ORIGIN = 'https://backend-three-beta-90.vercel.app';
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=600&q=80';

export function resolveImageUrl(src?: string): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const clean = src.trim();

  // 1. Base64 data URLs
  if (clean.startsWith('data:')) {
    return clean;
  }

  // 2. Absolute HTTP/HTTPS URLs
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // 3. Backend uploads
  if (clean.startsWith('/uploads')) {
    return `${BACKEND_ORIGIN}${clean}`;
  }

  // 4. Frontend public assets (e.g. /galery/...)
  if (clean.startsWith('/')) {
    return `${FRONTEND_ORIGIN}${encodeURI(clean)}`;
  }

  return `${FRONTEND_ORIGIN}/${encodeURI(clean)}`;
}
