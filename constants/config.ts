/**
 * App configuration
 * Set EXPO_PUBLIC_API_URL in .env (e.g. http://localhost:3030/api/v1)
 * For physical device: use your machine's IP instead of localhost
 */
export const API_URL =
  (typeof window !== 'undefined' && (window as unknown as { __API_URL__?: string }).__API_URL__) ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3030/api/v1';
