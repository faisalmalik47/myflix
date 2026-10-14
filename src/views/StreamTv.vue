<template>
  <div class="watch-stage min-h-screen bg-[#0b0a08] text-[#f5efe4] relative overflow-x-hidden selection:bg-[#E50914] selection:text-[#0b0a08]">
    <!-- Ambient Background Bloom from TV Backdrop -->
    <div 
      v-if="tv?.backdrop_path" 
      class="stream-frame__bloom"
      :style="{ backgroundImage: `url(${backdrop(tv.backdrop_path, 'w1280')})` }"
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
            v-if="tv"
            :to="{ name: 'TvDetail', params: { id: tv.id } }"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f5efe4]/5 hover:bg-[#E50914] text-[#f5efe4] hover:text-[#0b0a08] flex items-center justify-center transition-all duration-200 border border-[#f5efe4]/10 shrink-0 hover:-translate-x-0.5 active:scale-95"
            title="Back to Series"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>

          <div class="min-w-0">
            <div class="flex items-center gap-2 text-xs text-[#8a8270]">
              <router-link to="/" class="hover:text-[#f5efe4] transition-colors">Home</router-link>
              <span>/</span>
              <router-link to="/tv" class="hover:text-[#f5efe4] transition-colors">TV Shows</router-link>
            </div>
            <h1 v-if="tv" class="font-display font-medium text-base sm:text-lg text-[#f5efe4] truncate leading-tight">
              {{ tv.name }}
            </h1>
          </div>
        </div>

        <!-- Center / Right Metadata Pills -->
        <div v-if="tv" class="flex items-center gap-2 shrink-0">
          <span class="font-mono text-xs text-[#E50914] font-semibold bg-[#E50914]/10 px-2.5 py-1 rounded-full border border-[#E50914]/30">
            S{{ season }} &bull; E{{ episode }}
          </span>
          <span class="lm-pill lm-pill--sm lm-pill--ember">HD</span>
        </div>
      </div>
    </header>

    <!-- Main Stage Container -->
    <main class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 relative z-10">
      <!-- Cinema Player Frame with Accordion -->
      <section v-if="tv">
        <PlayerFrame 
          :key="`${tv.id}-${season}-${episode}`"
          :tmdbId="tv.id"
          mediaType="tv"
          :season="season"
          :episode="episode"
        />
      </section>

      <!-- Loading skeleton -->
      <section v-else class="w-full aspect-video bg-[#13110e] rounded-2xl flex flex-col items-center justify-center border border-[#f5efe4]/10">
        <div class="w-12 h-12 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin mb-3"></div>
        <span class="text-xs text-[#c7bfb0] font-medium font-mono">Cueing the projector…</span>
      </section>

      <!-- Up Next / Episode Quick Bar -->
      <section v-if="tv" class="bg-[#13110e] p-4 sm:p-5 rounded-2xl border border-[#f5efe4]/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <button 
          @click="prevEpisode"
          :disabled="!hasPrevEpisode"
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1c1915] hover:bg-[#2a251e] disabled:opacity-30 disabled:pointer-events-none text-[#f5efe4] text-xs font-semibold font-mono border border-[#f5efe4]/8 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous Episode
        </button>

        <div class="text-center">
          <div class="text-xs font-semibold text-[#f5efe4] font-display">
            {{ currentEpisodeName ? `E${episode}: ${currentEpisodeName}` : `Episode ${episode}` }}
          </div>
          <span class="text-[11px] text-[#8a8270] font-mono">
            Season {{ season }}, Episode {{ episode }} of {{ totalEpisodesInCurrentSeason || '?' }}
          </span>
        </div>

        <button 
          @click="nextEpisode"
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-[#E50914] to-[#FF1E27] hover:brightness-110 rounded-xl text-[#0b0a08] text-xs font-bold font-mono transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] active:scale-95"
        >
          <span>Next Episode</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      <!-- Cineby Episode Grid Browser -->
      <section v-if="tv" class="space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full bg-[#E50914]"></span>
          <h2 class="font-display text-xl sm:text-2xl font-medium text-[#f5efe4] tracking-tight">
            Episodes
          </h2>
        </div>

        <EpisodeGrid 
          v-if="tv.seasons"
          :seasons="tv.seasons"
          :tvId="tv.id" 
          :currentSeason="season"
          :currentEpisode="episode"
          @select="handleEpisodeSelect"
        />
      </section>

      <!-- TV Show Feature Details Section -->
      <section v-if="tv" class="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 bg-[#13110e]/70 p-6 sm:p-8 rounded-2xl border border-[#f5efe4]/8 shadow-xl">
        <!-- Left: Poster with rating -->
        <div class="relative w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-[#f5efe4]/10 mx-auto md:mx-0">
          <img 
            v-if="tv.poster_path"
            :src="poster(tv.poster_path, 'w500')" 
            :alt="tv.name" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-[#1c1915] flex items-center justify-center text-[#8a8270]">
            No Poster
          </div>

          <!-- Gold Leaf Rating Badge -->
          <div v-if="tv.vote_average" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0b0a08]/85 backdrop-blur-md border border-[#f5efe4]/15 flex items-center gap-1.5 shadow-lg">
            <span class="text-xs text-[#8a8270]">★</span>
            <span class="font-display font-semibold text-sm text-[#c9a76a]">{{ tv.vote_average.toFixed(1) }}</span>
          </div>
        </div>

        <!-- Right: TV Details -->
        <div class="flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-baseline gap-3 flex-wrap">
              <h2 class="font-display text-2xl sm:text-3xl font-medium text-[#f5efe4] tracking-tight">
                {{ tv.name }}
              </h2>
              <span v-if="tv.first_air_date" class="text-sm font-mono text-[#8a8270]">
                ({{ getYear(tv.first_air_date) }})
              </span>
            </div>

            <!-- Tagline -->
            <p v-if="tv.tagline" class="italic text-sm text-[#c9a76a] mt-1 font-display">
              "{{ tv.tagline }}"
            </p>

            <!-- Metadata shelf -->
            <div class="flex flex-wrap items-center gap-2 mt-4">
              <span v-for="genre in tv.genres" :key="genre.id" class="lm-pill lm-pill--sm lm-pill--neutral">
                {{ genre.name }}
              </span>
              <span class="lm-pill lm-pill--sm lm-pill--neutral font-mono">
                {{ tv.number_of_seasons }} Seasons &bull; {{ tv.number_of_episodes }} Episodes
              </span>
            </div>

            <!-- Overview -->
            <div class="mt-5">
              <h4 class="text-xs font-mono uppercase tracking-wider text-[#8a8270] mb-2">Overview</h4>
              <p class="text-sm sm:text-base text-[#c7bfb0] leading-relaxed max-w-3xl">
                {{ tv.overview || 'No synopsis available.' }}
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-[#f5efe4]/8 flex items-center gap-4 text-xs text-[#8a8270]">
            <span>Status: <strong class="text-[#f5efe4] font-medium">{{ tv.status || 'Ended' }}</strong></span>
            <span>&bull;</span>
            <span>Network: <strong class="text-[#f5efe4] font-medium">{{ tv.networks?.[0]?.name || 'N/A' }}</strong></span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTvShow, getSeason, backdrop, poster } from '@/api/tmdb.js'
import { useProgress } from '@/composables/useProgress.js'
import PlayerFrame from '@/components/PlayerFrame.vue'
import EpisodeGrid from '@/components/EpisodeGrid.vue'

const route = useRoute()
const router = useRouter()
const { saveProgress } = useProgress()

const tv = ref(null)
const currentSeasonData = ref(null)

const season = computed(() => parseInt(route.params.season) || 1)
const episode = computed(() => parseInt(route.params.episode) || 1)

const totalEpisodesInCurrentSeason = computed(() => {
  return currentSeasonData.value?.episodes?.length || 0
})

const currentEpisodeName = computed(() => {
  if (!currentSeasonData.value?.episodes) return ''
  const ep = currentSeasonData.value.episodes.find(e => e.episode_number === episode.value)
  return ep ? ep.name : ''
})

const hasPrevEpisode = computed(() => {
  return episode.value > 1 || season.value > 1
})

const fetchTvData = async () => {
  try {
    const id = route.params.id
    tv.value = await getTvShow(id)
    await loadSeasonData(season.value)
    
    if (tv.value) {
      document.title = `Stream · ${tv.value.name} (S${season.value}:E${episode.value}) — Cineby`
      saveProgress({
        id: tv.value.id,
        title: `${tv.value.name} - S${season.value}:E${episode.value}`,
        poster_path: tv.value.poster_path,
        backdrop_path: tv.value.backdrop_path,
        media_type: 'tv',
        season: season.value,
        episode: episode.value,
        watched_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error fetching TV show:', error)
  }
}

const loadSeasonData = async (seasonNum) => {
  try {
    const id = route.params.id
    currentSeasonData.value = await getSeason(id, seasonNum)
  } catch (error) {
    console.error(`Error fetching season ${seasonNum}:`, error)
  }
}

const handleEpisodeSelect = ({ season: s, episode: e }) => {
  router.push({
    name: 'StreamTv',
    params: { id: tv.value.id, season: s, episode: e }
  })
}

const prevEpisode = () => {
  if (episode.value > 1) {
    router.push({
      name: 'StreamTv',
      params: { id: tv.value.id, season: season.value, episode: episode.value - 1 }
    })
  } else if (season.value > 1) {
    // Go to previous season's last episode
    const prevSeasonNum = season.value - 1
    const prevSeasonMeta = tv.value.seasons.find(s => s.season_number === prevSeasonNum)
    const lastEp = prevSeasonMeta?.episode_count || 1
    router.push({
      name: 'StreamTv',
      params: { id: tv.value.id, season: prevSeasonNum, episode: lastEp }
    })
  }
}

const nextEpisode = () => {
  if (episode.value < totalEpisodesInCurrentSeason.value) {
    router.push({
      name: 'StreamTv',
      params: { id: tv.value.id, season: season.value, episode: episode.value + 1 }
    })
  } else {
    // Check if next season exists
    const nextSeasonNum = season.value + 1
    const nextSeasonMeta = tv.value.seasons.find(s => s.season_number === nextSeasonNum)
    if (nextSeasonMeta) {
      router.push({
        name: 'StreamTv',
        params: { id: tv.value.id, season: nextSeasonNum, episode: 1 }
      })
    }
  }
}

const getYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

watch(() => route.params.season, (newSeason) => {
  if (newSeason) loadSeasonData(parseInt(newSeason))
})

watch(() => [route.params.season, route.params.episode], () => {
  if (tv.value) {
    document.title = `Stream · ${tv.value.name} (S${season.value}:E${episode.value}) — Cineby`
    saveProgress({
      id: tv.value.id,
      title: `${tv.value.name} - S${season.value}:E${episode.value}`,
      poster_path: tv.value.poster_path,
      backdrop_path: tv.value.backdrop_path,
      media_type: 'tv',
      season: season.value,
      episode: episode.value,
      watched_at: new Date().toISOString()
    })
  }
})

onMounted(() => {
  fetchTvData()
})
</script>
