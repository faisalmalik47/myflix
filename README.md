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
```bash
docker build -t myflix:latest .
docker run -d -p 8090:80 --name myflix myflix:latest
```

---

## 📜 License
This project is open-source. All streams are embedded from non-affiliated third-party mirrors. MyFlix does not host any media files.
