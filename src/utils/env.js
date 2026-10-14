/**
 * Universal Environment Variable Resolver
 * Supports:
 * 1. Runtime injection via window.__ENV__ (generated on container start from server's mounted .env)
 * 2. Build-time / Dev-time injection via Vite import.meta.env
 * 3. Cross-compatibility between VITE_ and NEXT_PUBLIC_ naming conventions
 */

export function getEnv(key, fallback = '') {
  // 1. Check runtime window.__ENV__ (injected by Docker container on server)
  if (typeof window !== 'undefined' && window.__ENV__) {
    if (window.__ENV__[key]) return window.__ENV__[key]
  }

  // Cross-compatibility mappings between Vite and Next.js / Cinextma env names
  const mapping = {
    'VITE_SUPABASE_URL': ['NEXT_PUBLIC_SUPABASE_URL'],
    'NEXT_PUBLIC_SUPABASE_URL': ['VITE_SUPABASE_URL'],
    'VITE_SUPABASE_ANON_KEY': ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY': ['VITE_SUPABASE_ANON_KEY'],
    'VITE_TMDB_ACCESS_TOKEN': ['NEXT_PUBLIC_TMDB_ACCESS_TOKEN'],
    'NEXT_PUBLIC_TMDB_ACCESS_TOKEN': ['VITE_TMDB_ACCESS_TOKEN']
  }

  if (typeof window !== 'undefined' && window.__ENV__) {
    const alternates = mapping[key] || []
    for (const alt of alternates) {
      if (window.__ENV__[alt]) return window.__ENV__[alt]
    }
  }

  // 2. Check import.meta.env (for local development via .env.local)
  try {
    if (import.meta && import.meta.env) {
      if (import.meta.env[key]) return import.meta.env[key]
      const alternates = mapping[key] || []
      for (const alt of alternates) {
        if (import.meta.env[alt]) return import.meta.env[alt]
      }
    }
  } catch {
    // Ignore in non-Vite environments
  }

  return fallback
}
