# 🎬 MyFlix

A high-performance cinematic streaming platform built with **Vue 3**, **Vite**, and **Tailwind CSS**, featuring real-time stream benchmarking, Google OAuth authentication via **Supabase**, and multi-source streaming mirrors.

---

## ✨ Features

- **🔴 Modern Cinematic UI:** Netflix-inspired crimson theme with OLED dark canvas, glassmorphic controls, and responsive layouts.
- **⚡ 25+ High-Speed Streaming Mirrors:** Auto-buffering engine integrating VidBolt, Bolt (Filmu), Mega (Videasy), Nova (VidLink Pro), Alpha (VidFast), Hindi / Dual-Audio streams, CinemaOS, and more.
- **⛩️ Dedicated Anime Hub:** Curated trending anime, top-rated series, feature films, and dedicated Sub/Dub server tracks.
- **🔐 Cloud Authentication (Supabase):** One-click **Continue with Google** OAuth, user profiles, and cross-device watchlist syncing.
- **📊 Real-Time Stream Benchmarking:** Live server latency audits and score ranking to always connect users to the fastest video feed.
- **📱 Mobile App-Like Experience:** Floating bottom navigation bar and mobile sheets.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env.local
```
Fill in your credentials in `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_TMDB_ACCESS_TOKEN=your-tmdb-access-token
```

### 3. Installation
```bash
npm install
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:5189](http://localhost:5189) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

The production image is built automatically on push via GitHub Actions and published to Docker Hub at [`faisalmaliik/myflix`](https://hub.docker.com/r/faisalmaliik/myflix).

### 🏷️ Current Target Release Tag: `300f353`

```bash
docker pull faisalmaliik/myflix:300f353
```

---

## 🛠️ Home Server Deployment (`cloud-server`)

To replace or update the `cinextma` service in your server's `docker-compose.yml` (`/home/phil/server/docker-compose.yml`):

### 1. Update `docker-compose.yml`

Update the `cinextma` service block to use the **`300f353`** image tag and forward port `8090` to container port `80` (Nginx):

```yaml
  cinextma:
    image: faisalmaliik/myflix:300f353
    container_name: cinextma
    restart: always
    ports:
      - "8090:80"
    environment:
      - NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
      - NEXT_PUBLIC_SUPABASE_URL=https://cnnsouwudpcukmzxftcc.supabase.co
      - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
    deploy:
      resources:
        limits:
          memory: 256M
```

> **Note on Environment Mappings:**
> MyFlix's entrypoint script (`docker-entrypoint.sh`) dynamically generates `/usr/share/nginx/html/env-config.js` (`window.__ENV__`) at container boot. It automatically detects and supports:
> 1. Standard `VITE_*` environment variables (`VITE_TMDB_ACCESS_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
> 2. Existing `NEXT_PUBLIC_*` server variables (`NEXT_PUBLIC_TMDB_ACCESS_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
> 3. Optional direct volume mount for `.env`:
>    ```yaml
>    volumes:
>      - /home/phil/server/.env:/app/.env:ro
>    ```

### 2. Pull & Restart Service on Server

Run on the server:

```bash
cd ~/server
docker compose pull cinextma
docker compose up -d cinextma
```

### 3. Verify Container Environment & Logs

```bash
# Check if the container booted properly
docker logs cinextma

# Verify that env-config.js was populated with your keys
docker exec cinextma cat /usr/share/nginx/html/env-config.js
```

---

## ⚡ Automated CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/docker-build-push.yml`) automates both building and deployment on push to `main`:

1. **Security Gate:** Only authorized repository owner/actor (`faisalmalik47` / `faisalmaliik`) can trigger the build and deploy jobs.
2. **CI (Docker Hub):** Builds the production container and pushes a single image tagged with the commit SHA (`faisalmaliik/myflix:<commit_id>`).
3. **CD (Tailscale SSH):** Authenticates to your private Tailscale network, connects via SSH to your home server (`cloud-server`), updates `docker-compose.yml` with the new tag, pulls the image, and restarts the container with zero downtime.

### Required GitHub Secrets
In your GitHub repo (**Settings > Secrets and variables > Actions**), configure:

| Secret | Description | Default / Example |
|---|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username | `faisalmaliik` |
| `DOCKERHUB_TOKEN` | Docker Hub personal access token | `dckr_pat_...` |
| `TAILSCALE_AUTHKEY` | Tailscale reusable auth key | `tskey-auth-...` |
| `SERVER_SSH_KEY` | Private SSH key for server user `phil` | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | Tailscale IP of your server *(optional)* | `100.98.17.74` |
| `SERVER_USER` | Linux SSH username *(optional)* | `phil` |

---

## 📜 License
This project is open-source. All streams are embedded from non-affiliated third-party mirrors. MyFlix does not host any media files.
