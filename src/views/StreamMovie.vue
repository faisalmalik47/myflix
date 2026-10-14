<template>
  <div class="watch-stage min-h-screen bg-[#0b0a08] text-[#f5efe4] relative overflow-x-hidden selection:bg-[#E50914] selection:text-[#0b0a08]">
    <!-- Ambient Background Bloom from Movie Backdrop -->
    <div 
      v-if="movie?.backdrop_path" 
      class="stream-frame__bloom"
      :style="{ backgroundImage: `url(${backdrop(movie.backdrop_path, 'w1280')})` }"
      aria-hidden="true"
    ></div>

    <!-- Watch Stage Sticky Chrome Header -->
    <header class="sticky top-0 z-40 bg-[#0b0a08]/95 backdrop-blur-md border-b border-[#f5efe4]/10 shadow-lg">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <!-- Left: Brand Logo, Back Button & Breadcrumbs/Title -->
        <div class="flex items-center gap-3 sm:gap-4 min-w-0">
          <router-link to="/" class="flex items-center gap-1 group shrink-0" title="Back to Home">
            <span class="text-xl sm:text-2xl font-display font-black tracking-wider text-white">
              MY<span class="text-[#E50914]">FLIX</span>
            </span>
          </router-link>

          <span class="text-white/20 hidden sm:inline">&bull;</span>

          <router-link
            v-if="movie"
            :to="{ name: 'MovieDetail', params: { id: movie.id } }"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f5efe4]/5 hover:bg-[#E50914] text-[#f5efe4] hover:text-[#0b0a08] flex items-center justify-center transition-all duration-200 border border-[#f5efe4]/10 shrink-0 hover:-translate-x-0.5 active:scale-95"
            title="Back to Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>

          <div class="min-w-0">
            <div class="flex items-center gap-2 text-xs text-[#8a8270]">
              <router-link to="/" class="hover:text-[#f5efe4] transition-colors">Home</router-link>
              <span>/</span>
              <router-link to="/movies" class="hover:text-[#f5efe4] transition-colors">Movies</router-link>
            </div>
            <h1 v-if="movie" class="font-display font-medium text-base sm:text-lg text-[#f5efe4] truncate leading-tight">
              {{ movie.title }}
            </h1>
          </div>
        </div>

        <!-- Center / Right Metadata Pills -->
        <div v-if="movie" class="flex items-center gap-2 shrink-0">
          <span class="font-mono text-xs text-[#8a8270] hidden md:inline-block">
            {{ getYear(movie.release_date) }} &bull; {{ formatRuntime(movie.runtime) }}
          </span>
          <span class="lm-pill lm-pill--sm lm-pill--ember">HD</span>
        </div>
      </div>
    </header>

    <!-- Main Stage Container -->
    <main class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 relative z-10">
      <!-- Cinema Player Frame with Accordion -->
      <section v-if="movie">
        <PlayerFrame 
          :tmdbId="movie.id"
          mediaType="movie"
        />
      </section>

      <!-- Loading skeleton -->
      <section v-else class="w-full aspect-video bg-[#13110e] rounded-2xl flex flex-col items-center justify-center border border-[#f5efe4]/10">
        <div class="w-12 h-12 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin mb-3"></div>
        <span class="text-xs text-[#c7bfb0] font-medium font-mono">Cueing the projector…</span>
      </section>

      <!-- Movie Feature & Metadata Section -->
      <section v-if="movie" class="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 bg-[#13110e]/70 p-6 sm:p-8 rounded-2xl border border-[#f5efe4]/8 shadow-xl">
        <!-- Left: Poster with rating -->
        <div class="relative w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-[#f5efe4]/10 mx-auto md:mx-0">
          <img 
            v-if="movie.poster_path"
            :src="poster(movie.poster_path, 'w500')" 
            :alt="movie.title" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-[#1c1915] flex items-center justify-center text-[#8a8270]">
            No Poster
          </div>

          <!-- Gold Leaf Rating Badge -->
          <div v-if="movie.vote_average" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0b0a08]/85 backdrop-blur-md border border-[#f5efe4]/15 flex items-center gap-1.5 shadow-lg">
            <span class="text-xs text-[#8a8270]">★</span>
            <span class="font-display font-semibold text-sm text-[#c9a76a]">{{ movie.vote_average.toFixed(1) }}</span>
          </div>
        </div>

        <!-- Right: Movie Details -->
        <div class="flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-baseline gap-3 flex-wrap">
              <h2 class="font-display text-2xl sm:text-3xl font-medium text-[#f5efe4] tracking-tight">
                {{ movie.title }}
              </h2>
              <span v-if="movie.release_date" class="text-sm font-mono text-[#8a8270]">
                ({{ getYear(movie.release_date) }})
              </span>
            </div>

            <!-- Tagline -->
            <p v-if="movie.tagline" class="italic text-sm text-[#c9a76a] mt-1 font-display">
              "{{ movie.tagline }}"
            </p>

            <!-- Metadata shelf -->
            <div class="flex flex-wrap items-center gap-2 mt-4">
              <span v-for="genre in movie.genres" :key="genre.id" class="lm-pill lm-pill--sm lm-pill--neutral">
                {{ genre.name }}
              </span>
              <span v-if="movie.runtime" class="lm-pill lm-pill--sm lm-pill--neutral font-mono">
                {{ formatRuntime(movie.runtime) }}
              </span>
            </div>

            <!-- Overview -->
            <div class="mt-5">
              <h4 class="text-xs font-mono uppercase tracking-wider text-[#8a8270] mb-2">Overview</h4>
              <p class="text-sm sm:text-base text-[#c7bfb0] leading-relaxed max-w-3xl">
                {{ movie.overview || 'No synopsis available.' }}
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-[#f5efe4]/8 flex items-center gap-4 text-xs text-[#8a8270]">
            <span>Status: <strong class="text-[#f5efe4] font-medium">{{ movie.status || 'Released' }}</strong></span>
            <span>&bull;</span>
            <span>Original Language: <strong class="text-[#f5efe4] font-medium uppercase">{{ movie.original_language }}</strong></span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovie, backdrop, poster } from '@/api/tmdb.js'
import { useProgress } from '@/composables/useProgress.js'
import PlayerFrame from '@/components/PlayerFrame.vue'

const route = useRoute()
const { saveProgress } = useProgress()

const movie = ref(null)

const fetchMovie = async () => {
  try {
    const id = route.params.id
    movie.value = await getMovie(id)
    
    if (movie.value) {
      document.title = `Stream · ${movie.value.title} — Cineby`
      saveProgress({
        id: movie.value.id,
        title: movie.value.title,
        poster_path: movie.value.poster_path,
        backdrop_path: movie.value.backdrop_path,
        media_type: 'movie',
        watched_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error fetching movie:', error)
  }
}

const getYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

const formatRuntime = (mins) => {
  if (!mins) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

onMounted(() => {
  fetchMovie()
})
</script>
