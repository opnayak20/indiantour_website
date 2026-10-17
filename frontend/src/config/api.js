/**
 * Unified API Configuration
 * 1. On production (e.g. antiquewhite-seal-759506.hostingersite.com or any public domain):
 *    Uses relative /api or current origin.
 * 2. On local dev machine:
 *    Uses VITE_API_URL or defaults to the deployed Hostinger backend.
 */
export const API_BASE = (() => {
  if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return `${window.location.origin}/api`;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'https://antiquewhite-seal-759506.hostingersite.com/api';
})();

export default API_BASE;
