/**
 * Resolve an API path to either:
 *  - a relative path (Next.js SSR / Vercel): /api/...
 *  - an absolute Vercel URL (Capacitor static export): https://roziq.vercel.app/api/...
 *
 * Usage:  fetch(apiUrl('/api/agent/mufti'), { ... })
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? '';
  return `${base}${path}`;
}
