<template>
  <div 
    v-if="item" 
    class="relative w-full overflow-hidden transition-all duration-300
           /* Mobile Netflix Floating Framed Card */
           mx-auto max-w-[94%] sm:max-w-none mt-24 mb-4 sm:my-0 rounded-[26px] sm:rounded-none border border-white/10 sm:border-0 shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:shadow-none
           h-[66vh] min-h-[480px] max-h-[600px] sm:h-[85vh] sm:min-h-[500px] sm:max-h-none bg-surface flex items-end sm:items-center"
  >
    <!-- Background Image with Multi-layer Cinematic Vignette -->
    <div class="absolute inset-0 select-none pointer-events-none">
      <img
        :src="backdrop(item.backdrop_path, 'original') || poster(item.poster_path, 'original')"
        :alt="item.title || item.name"
        class="w-full h-full object-cover scale-105 transform motion-safe:animate-pulse transition-transform duration-1000 object-center sm:object-top"
        @error="handleImageError"
      />
      <div class="absolute inset-0 cinematic-fade-b"></div>
      <div class="absolute inset-0 cinematic-fade-r hidden sm:block"></div>
      <!-- Multi-stop Dark Bottom Gradient for mobile title legibility -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent sm:from-[#0a0a0c] sm:via-transparent sm:to-black/60"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 md:px-8 relative z-10 pb-6 sm:pb-0 sm:pt-20 w-full">
      <div class="max-w-2xl text-center sm:text-left space-y-3 sm:space-y-4 mx-auto sm:mx-0">
        
        <!-- Metadata Pill Badges (Desktop) -->
        <div class="hidden sm:inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-100/90 backdrop-blur-md border border-white/10 text-xs">
          <span class="flex items-center text-[#E50914] font-bold font-mono">
            ★ {{ (item.vote_average || 0).toFixed(1) }}
          </span>
          <span class="text-white/20">&bull;</span>
          <span v-if="item.release_date || item.first_air_date" class="text-bone-300 font-mono text-xs">
            {{ new Date(item.release_date || item.first_air_date).getFullYear() }}
          </span>
          <span class="text-white/20">&bull;</span>
          <span class="px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] font-mono font-bold text-[10px] uppercase">
            {{ (item.media_type || defaultMediaType) === 'tv' ? 'TV Series' : 'Movie' }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-wide uppercase leading-tight drop-shadow-2xl px-2 sm:px-0">
          {{ item.title || item.name }}
        </h1>

        <!-- Mobile Tagline (Like 'New episode coming on Wednesday') -->
        <p class="sm:hidden text-xs text-bone-300 font-medium drop-shadow flex items-center justify-center gap-2">
          <span class="text-[#E50914] font-bold">★ {{ (item.vote_average || 0).toFixed(1) }}</span>
          <span>&bull;</span>
          <span>Trending #1 Today</span>
          <span>&bull;</span>
          <span>{{ (item.media_type || defaultMediaType) === 'tv' ? 'TV Series' : 'Movie' }}</span>
        </p>
        
        <!-- Overview (Desktop) -->
        <p class="hidden sm:block text-bone-300 text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow max-w-xl font-normal">
          {{ item.overview }}
        </p>

        <!-- ============================================== -->
        <!-- MOBILE NETFLIX DUAL CTAS: [ ▶ Play ] [ + My List ] -->
        <!-- ============================================== -->
        <div class="flex sm:hidden items-center gap-2.5 pt-2 px-1">
          <!-- Play Show / Movie Button -->
          <router-link
            :to="streamRoute"
            class="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-bone-100 text-black py-3 rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-black" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <span>Play {{ (item.media_type || defaultMediaType) === 'tv' ? 'Show' : 'Movie' }}</span>
          </router-link>

          <!-- My List Button -->
          <button
            @click="handleToggleList"
            class="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-3 rounded-full font-bold text-sm border border-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <svg v-if="isInList" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#E50914]" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{{ isInList ? 'In List' : 'My List' }}</span>
          </button>
        </div>

        <!-- ============================================== -->
        <!-- DESKTOP ACTION BUTTONS -->
        <!-- ============================================== -->
        <div class="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3 pt-2">
          <!-- Watch Now (Play) -->
          <router-link
            :to="streamRoute"
            class="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E50914] to-[#FF1E27] hover:brightness-110 text-white px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.5)] transform hover:-translate-y-0.5 active:scale-95"
          >
            <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current ml-0.5 text-white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>Watch Now</span>
          </router-link>

          <!-- Trailer Button -->
          <button
            @click="openTrailer"
            :disabled="loadingTrailer"
            class="inline-flex items-center justify-center gap-2 bg-surface-100/90 hover:bg-surface-200 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 border border-white/10 hover:border-white/25 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Watch Trailer"
          >
            <svg v-if="!loadingTrailer" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span v-else class="w-4 h-4 rounded-full border-2 border-white/20 border-t-[#E50914] animate-spin"></span>
            <span>Trailer</span>
          </button>

          <!-- My List Toggle Button -->
          <button
            @click="handleToggleList"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 border transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            :class="isInList 
              ? 'bg-[#E50914] hover:bg-[#FF1E27] text-white border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.4)]' 
              : 'bg-surface-100/90 hover:bg-surface-200 text-white border-white/10 hover:border-white/25'"
          >
            <svg v-if="isInList" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-bone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{{ isInList ? 'In List' : 'My List' }}</span>
          </button>

          <!-- Random Movie Suggestion Button Next to My List -->
          <button
            @click="openSuggestion"
            class="inline-flex items-center justify-center gap-2 bg-surface-100/90 hover:bg-surface-200 text-[#f5efe4] hover:text-white px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 border border-white/10 hover:border-[#E50914]/50 transform hover:-translate-y-0.5 active:scale-95 group shadow-sm cursor-pointer"
            title="Random suggestion based on your watch history"
          >
            <span class="group-hover:rotate-180 transition-transform duration-500 text-base">🎲</span>
            <span>Surprise Me</span>
          </button>
          
          <!-- Overview for desktop -->
          <router-link
            :to="detailRoute"
            class="inline-flex items-center gap-2 bg-surface-100/90 hover:bg-surface-200 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 border border-white/10 hover:border-white/25 transform hover:-translate-y-0.5 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-bone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Overview</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Trailer Modal -->
    <TrailerModal
      v-if="showTrailer"
      :trailerKey="trailerKey"
      :show="showTrailer"
      @close="showTrailer = false"
    />
  </div>
  <div v-else class="w-full h-[70vh] md:h-[85vh] min-h-[500px] bg-surface-100 skeleton-shimmer flex items-center justify-center">
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { backdrop, getMovie, getTvShow } from '@/api/tmdb.js'
import { useWatchlist } from '@/composables/useWatchlist.js'
import { useRecommendation } from '@/composables/useRecommendation.js'
import TrailerModal from '@/components/TrailerModal.vue'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const { isInWatchlist, toggleWatchlist } = useWatchlist()
const { openSuggestion } = useRecommendation()

const showTrailer = ref(false)
const trailerKey = ref('')
const loadingTrailer = ref(false)

const isInList = computed(() => {
  if (!props.item) return false
  return isInWatchlist(props.item.id)
})

const handleToggleList = () => {
  if (props.item) {
    toggleWatchlist(props.item, defaultMediaType.value)
  }
}

const defaultMediaType = computed(() => {
  if (!props.item) return 'movie'
  return props.item.name && !props.item.title ? 'tv' : 'movie'
})

const openTrailer = async () => {
  if (!props.item) return
  if (trailerKey.value) {
    showTrailer.value = true
    return
  }
  loadingTrailer.value = true
  try {
    const type = props.item.media_type || defaultMediaType.value
    const details = type === 'movie' 
      ? await getMovie(props.item.id, { append_to_response: 'videos' })
      : await getTvShow(props.item.id, { append_to_response: 'videos' })
    const videos = details?.videos?.results || []
    const yt = videos.filter(v => v.site?.toLowerCase() === 'youtube' && v.key)
    const officialTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer' && v.official)
    const anyTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer')
    const teaser = yt.find(v => v.type?.toLowerCase() === 'teaser')
    const clip = yt.find(v => v.type?.toLowerCase() === 'clip')
    trailerKey.value = officialTrailer?.key || anyTrailer?.key || teaser?.key || clip?.key || yt[0]?.key || ''
  } catch (err) {
    console.error('Failed to fetch trailer:', err)
  } finally {
    loadingTrailer.value = false
    showTrailer.value = true
  }
}

const streamRoute = computed(() => {
  if (!props.item) return '/'
  const type = props.item.media_type || defaultMediaType.value
  return type === 'movie' 
    ? { name: 'StreamMovie', params: { id: props.item.id } }
    : { name: 'StreamTv', params: { id: props.item.id, season: 1, episode: 1 } }
})

const detailRoute = computed(() => {
  if (!props.item) return '/'
  const type = props.item.media_type || defaultMediaType.value
  return type === 'movie' 
    ? { name: 'MovieDetail', params: { id: props.item.id } }
    : { name: 'TvDetail', params: { id: props.item.id } }
})

const handleImageError = (e) => {
  e.target.style.display = 'none'
}
</script>

