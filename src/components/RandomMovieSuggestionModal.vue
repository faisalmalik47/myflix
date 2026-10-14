<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[110] flex items-center justify-center p-3.5 sm:p-6 bg-black/90 backdrop-blur-md select-none overflow-y-auto"
      @click="closeSuggestion"
    >
      <div 
        class="relative w-full max-w-2xl bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] my-auto transition-all"
        @click.stop
      >
        <!-- Close Button -->
        <button 
          @click="closeSuggestion"
          class="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-[#E50914] text-white/80 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95"
          title="Close (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- ======================================================== -->
        <!-- STEP 1: INTERACTIVE QUESTIONNAIRE (ASK BEFORE SUGGESTING) -->
        <!-- ======================================================== -->
        <div v-if="step === 'prompt'" class="p-6 sm:p-8">
          <!-- Heading -->
          <div class="text-left mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] text-xs font-mono font-bold mb-3">
              <span>🎲</span>
              <span>TASTE MATCH PICKER</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
              What are you in the mood for?
            </h2>
            <p class="text-bone-400 text-xs sm:text-sm mt-1">
              Tell us what you want to watch — we'll tailor a random pick to your taste.
            </p>
          </div>

          <!-- Question 1: Format / Category -->
          <div class="mb-6">
            <label class="block text-xs font-mono uppercase tracking-wider text-bone-400 font-semibold mb-2.5">
              1. What format do you want?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                v-for="cat in formatOptions"
                :key="cat.value"
                type="button"
                @click="selectedType = cat.value"
                class="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border text-center transition-all duration-200"
                :class="selectedType === cat.value
                  ? 'bg-gradient-to-b from-[#E50914]/25 to-[#E50914]/10 border-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.3)] scale-[1.02]'
                  : 'bg-surface-100/80 hover:bg-surface-200 border-white/8 text-bone-300 hover:text-white'"
              >
                <span class="text-2xl sm:text-3xl mb-1.5">{{ cat.icon }}</span>
                <span class="text-xs font-bold">{{ cat.label }}</span>
                <span class="text-[10px] text-bone-400 font-normal mt-0.5">{{ cat.hint }}</span>
              </button>
            </div>
          </div>

          <!-- Question 2: Vibe / Mood / Filter ("What Else?") -->
          <div class="mb-8">
            <label class="block text-xs font-mono uppercase tracking-wider text-bone-400 font-semibold mb-2.5">
              2. What's the vibe tonight?
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="vibe in vibeOptions"
                :key="vibe.value"
                type="button"
                @click="selectedVibe = vibe.value"
                class="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all text-xs"
                :class="selectedVibe === vibe.value
                  ? 'bg-[#E50914] border-[#E50914] text-white font-bold shadow-md'
                  : 'bg-surface-100/60 hover:bg-surface-200 border-white/8 text-bone-300 hover:text-white'"
              >
                <span class="text-base shrink-0">{{ vibe.icon }}</span>
                <span class="truncate">{{ vibe.label }}</span>
              </button>
            </div>
          </div>

          <!-- CTA: Roll Recommendation -->
          <div class="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
            <span class="text-xs text-bone-400 hidden sm:inline-block">
              Picks from 100,000+ titles with trailers & instant streaming
            </span>
            <button
              @click="handleStartSurprise"
              class="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#E50914] to-[#FF1E27] hover:brightness-110 active:scale-95 text-white px-7 py-3 rounded-full text-sm font-bold transition-all shadow-[0_0_25px_rgba(229,9,20,0.5)] cursor-pointer"
            >
              <span>🎲</span>
              <span>Find My Match</span>
            </button>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- STEP 2: LOADING STATE -->
        <!-- ======================================================== -->
        <div v-else-if="isLoading" class="p-12 flex flex-col items-center justify-center text-center min-h-[380px] gap-4">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-[#E50914]/20 border-t-[#E50914] animate-spin"></div>
            <span class="text-2xl animate-bounce">🎲</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-display">Finding your next favorite {{ selectedType === 'anime' ? 'anime' : selectedType === 'tv' ? 'show' : 'film' }}...</h3>
            <p class="text-xs text-bone-400 mt-1">Filtering by {{ getVibeLabel() }}</p>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- STEP 3: RESULT SUGGESTION CARD -->
        <!-- ======================================================== -->
        <div v-else-if="currentSuggestion" class="relative">
          <!-- Backdrop Banner -->
          <div class="relative h-48 sm:h-56 w-full overflow-hidden">
            <img 
              v-if="currentSuggestion.backdrop_path"
              :src="backdrop(currentSuggestion.backdrop_path, 'w1280')" 
              :alt="currentSuggestion.title || currentSuggestion.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-[#0e0e12]/60 to-black/40"></div>
            
            <!-- Top Controls: Back to Vibe Selector + Taste Reason Badge -->
            <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-14 flex items-center gap-2 z-10">
              <button
                @click="backToPrompt"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 hover:bg-[#E50914] text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                title="Change format or vibe"
              >
                <span>&larr;</span>
                <span>Change Vibe</span>
              </button>

              <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-[#f5efe4] shadow-md truncate min-w-0">
                <span class="text-[#E50914] text-sm shrink-0">✨</span>
                <span class="font-medium truncate">{{ currentSuggestion.reason }}</span>
              </div>
            </div>
          </div>

          <!-- Body details -->
          <div class="p-6 pt-0 relative z-10 -mt-12 sm:-mt-16 flex gap-4 sm:gap-6">
            <!-- Poster Thumbnail -->
            <div class="w-24 sm:w-32 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-surface-100 hidden sm:block">
              <img 
                v-if="currentSuggestion.poster_path"
                :src="poster(currentSuggestion.poster_path, 'w342')" 
                :alt="currentSuggestion.title || currentSuggestion.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pt-2 sm:pt-4 text-left">
              <!-- Meta Badges -->
              <div class="flex items-center gap-2 text-xs font-mono mb-2">
                <span class="text-[#c9a76a] font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  <span>★</span>
                  <span>{{ (currentSuggestion.vote_average || 0).toFixed(1) }}</span>
                </span>
                <span v-if="currentSuggestion.release_date || currentSuggestion.first_air_date" class="text-bone-400">
                  {{ (currentSuggestion.release_date || currentSuggestion.first_air_date).split('-')[0] }}
                </span>
                <span class="text-white/20">&bull;</span>
                <span class="text-[10px] uppercase font-bold text-[#E50914] bg-[#E50914]/15 px-2 py-0.5 rounded">
                  {{ isTvShow ? 'TV Series' : 'Movie' }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-xl sm:text-2xl font-bold font-display text-white line-clamp-1 drop-shadow mb-2">
                {{ currentSuggestion.title || currentSuggestion.name }}
              </h2>

              <!-- Overview -->
              <p class="text-bone-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 font-normal">
                {{ currentSuggestion.overview || 'No description available for this title.' }}
              </p>

              <!-- Actions Row (Clean 2x2 grid on mobile, flex row on desktop) -->
              <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 pt-1">
                <!-- Play Now Button -->
                <button
                  @click="watchNow"
                  class="flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#FF1E27] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <span>Play Now</span>
                </button>

                <!-- Trailer Button (Right Beside Play Now) -->
                <button
                  @click="openTrailer"
                  :disabled="loadingTrailer"
                  class="flex items-center justify-center gap-1.5 bg-surface-100 hover:bg-surface-200 text-[#f5efe4] hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-white/10 hover:border-white/25 active:scale-95 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
                  title="Watch Trailer"
                >
                  <svg v-if="!loadingTrailer" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span v-else class="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#E50914] animate-spin"></span>
                  <span>Trailer</span>
                </button>

                <!-- Watchlist Button -->
                <button
                  @click="toggleList"
                  class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border cursor-pointer w-full sm:w-auto"
                  :class="isInList 
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/15' 
                    : 'bg-surface-100 hover:bg-surface-200 text-bone-300 hover:text-white border-white/10'"
                >
                  <svg v-if="isInList" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#E50914]" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{{ isInList ? 'In My List' : 'Add to List' }}</span>
                </button>

                <!-- Roll Again -->
                <button
                  @click="rollAgain"
                  class="flex items-center justify-center gap-1.5 bg-surface-100 hover:bg-surface-200 text-bone-300 hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-white/10 hover:border-white/20 active:scale-95 group cursor-pointer w-full sm:w-auto"
                  title="Roll another suggestion in this vibe"
                >
                  <span class="group-hover:rotate-180 transition-transform duration-300">🎲</span>
                  <span>Roll Another</span>
                </button>

                <!-- Screening Details -->
                <button
                  @click="viewDetails"
                  class="col-span-2 sm:col-span-1 text-center sm:text-left text-xs text-bone-400 hover:text-white py-2 transition-colors sm:ml-auto underline-offset-4 hover:underline cursor-pointer"
                >
                  Screening Page &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-Trailer Modal -->
        <TrailerModal
          v-if="showTrailer"
          :trailerKey="trailerKey"
          :show="showTrailer"
          @close="showTrailer = false"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { backdrop, poster, getMovie, getTvShow } from '@/api/tmdb.js'
import { useRecommendation } from '@/composables/useRecommendation.js'
import { useWatchlist } from '@/composables/useWatchlist.js'
import TrailerModal from '@/components/TrailerModal.vue'

const router = useRouter()
const { 
  isOpen, 
  isLoading, 
  step, 
  selectedType, 
  selectedVibe, 
  currentSuggestion, 
  submitPrompt, 
  backToPrompt, 
  rollAgain, 
  closeSuggestion 
} = useRecommendation()

const { isInWatchlist, toggleWatchlist } = useWatchlist()

const showTrailer = ref(false)
const trailerKey = ref('')
const loadingTrailer = ref(false)

// Format Options
const formatOptions = [
  { label: 'Movies', value: 'movie', icon: '🎬', hint: 'Feature films' },
  { label: 'TV Shows', value: 'tv', icon: '📺', hint: 'Series & seasons' },
  { label: 'Anime', value: 'anime', icon: '⛩️', hint: 'Japanese animation' },
  { label: 'Surprise All', value: 'any', icon: '🎲', hint: 'Anything goes' },
]

// Vibe Options ("What else?")
const vibeOptions = [
  { label: 'My Taste', value: 'taste', icon: '✨' },
  { label: 'Action & Thrills', value: 'action', icon: '🔥' },
  { label: 'Sci-Fi & Mind-Benders', value: 'scifi', icon: '🧠' },
  { label: 'Comedy & Chill', value: 'comedy', icon: '🍿' },
  { label: 'Dark & Horror', value: 'horror', icon: '😱' },
  { label: 'Romance & Drama', value: 'romance', icon: '💖' },
  { label: 'Critically Acclaimed (8.0+)', value: 'top_rated', icon: '🏆' },
  { label: 'Hidden Gems', value: 'hidden_gems', icon: '⚡' },
  { label: 'Quick Watch (< 90m)', value: 'quick', icon: '⏱️' },
]

const isTvShow = computed(() => {
  if (!currentSuggestion.value) return false
  return currentSuggestion.value.media_type === 'tv' || (!currentSuggestion.value.title && !!currentSuggestion.value.name)
})

const isInList = computed(() => {
  if (!currentSuggestion.value) return false
  return isInWatchlist(currentSuggestion.value.id)
})

const getVibeLabel = () => {
  const v = vibeOptions.find(o => o.value === selectedVibe.value)
  return v ? v.label : 'your preferences'
}

const handleStartSurprise = () => {
  submitPrompt(selectedType.value, selectedVibe.value)
}

const toggleList = () => {
  if (currentSuggestion.value) {
    toggleWatchlist(currentSuggestion.value, isTvShow.value ? 'tv' : 'movie')
  }
}

const watchNow = () => {
  if (!currentSuggestion.value) return
  const id = currentSuggestion.value.id
  const isTv = isTvShow.value
  closeSuggestion()
  if (isTv) {
    router.push({ name: 'StreamTv', params: { id, season: 1, episode: 1 } })
  } else {
    router.push({ name: 'StreamMovie', params: { id } })
  }
}

const viewDetails = () => {
  if (!currentSuggestion.value) return
  const id = currentSuggestion.value.id
  const isTv = isTvShow.value
  closeSuggestion()
  if (isTv) {
    router.push({ name: 'TvDetail', params: { id } })
  } else {
    router.push({ name: 'MovieDetail', params: { id } })
  }
}

const openTrailer = async () => {
  if (!currentSuggestion.value) return
  if (trailerKey.value) {
    showTrailer.value = true
    return
  }
  loadingTrailer.value = true
  try {
    const isTv = isTvShow.value
    const details = isTv 
      ? await getTvShow(currentSuggestion.value.id, { append_to_response: 'videos' })
      : await getMovie(currentSuggestion.value.id, { append_to_response: 'videos' })
    const videos = details?.videos?.results || []
    const yt = videos.filter(v => v.site?.toLowerCase() === 'youtube' && v.key)
    const officialTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer' && v.official)
    const anyTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer')
    const teaser = yt.find(v => v.type?.toLowerCase() === 'teaser')
    const clip = yt.find(v => v.type?.toLowerCase() === 'clip')
    trailerKey.value = officialTrailer?.key || anyTrailer?.key || teaser?.key || clip?.key || yt[0]?.key || ''
  } catch (err) {
    console.error('Failed to fetch trailer for recommendation:', err)
  } finally {
    loadingTrailer.value = false
    showTrailer.value = true
  }
}

watch(currentSuggestion, () => {
  trailerKey.value = ''
  showTrailer.value = false
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeSuggestion()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
