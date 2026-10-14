#!/bin/sh
set -e

ENV_FILE="/usr/share/nginx/html/env-config.js"

# 1. If a .env file is mounted to /app/.env or /.env on the host server, read it
if [ -f "/app/.env" ]; then
  set -a
  . /app/.env
  set +a
elif [ -f "/.env" ]; then
  set -a
  . /.env
  set +a
fi

# 2. Extract environment variables supporting both VITE_ and NEXT_PUBLIC_ styles
TMDB_TOKEN="${VITE_TMDB_ACCESS_TOKEN:-${NEXT_PUBLIC_TMDB_ACCESS_TOKEN:-}}"
SUPABASE_URL="${VITE_SUPABASE_URL:-${NEXT_PUBLIC_SUPABASE_URL:-}}"
SUPABASE_KEY="${VITE_SUPABASE_ANON_KEY:-${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:-}}"

# 3. Write runtime configuration to env-config.js for Nginx
cat <<EOF > "$ENV_FILE"
window.__ENV__ = {
  VITE_TMDB_ACCESS_TOKEN: "${TMDB_TOKEN}",
  NEXT_PUBLIC_TMDB_ACCESS_TOKEN: "${TMDB_TOKEN}",
  VITE_SUPABASE_URL: "${SUPABASE_URL}",
  NEXT_PUBLIC_SUPABASE_URL: "${SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${SUPABASE_KEY}",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "${SUPABASE_KEY}"
};
EOF

# 4. Execute the main container process (nginx)
exec "$@"
