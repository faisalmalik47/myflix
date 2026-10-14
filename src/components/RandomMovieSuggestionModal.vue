<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md select-none"
      @click="closeSuggestion"
    >
      <div 
        class="relative w-full max-w-2xl bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
        @click.stop
      >
        <!-- Close Button -->
        <button 
          @click="closeSuggestion"
          class="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-[#E50914] text-white/80 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95"
          title="Close (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center text-center min-h-[360px] gap-4">
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-[#E50914]/20 border-t-[#E50914] animate-spin"></div>
            <span class="text-2xl animate-bounce">🎲</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-display">Finding your next favorite film...</h3>
            <p class="text-xs text-bone-400 mt-1">Analyzing your watch history and taste profile</p>
          </div>
        </div>

        <!-- Suggestion Content -->
        <div v-else-if="currentSuggestion" class="relative">
          <!-- Backdrop Banner -->
          <div class="relative h-48 sm:h-56 w-full overflow-hidden">
            <img 
              v-if="currentSuggestion.backdrop_path"
              :src="backdrop(currentSuggestion.backdrop_path, 'w1280')" 
              :alt="currentSuggestion.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-[#0e0e12]/60 to-black/40"></div>
            
            <!-- Taste Reason Badge -->
            <div class="absolute top-4 left-4 max-w-[80%] z-10">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-[#f5efe4] shadow-md">
                <span class="text-[#E50914] text-sm">✨</span>
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
                :alt="currentSuggestion.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 pt-2 sm:pt-4">
              <!-- Meta Badges -->
              <div class="flex items-center gap-2 text-xs font-mono mb-2">
                <span class="text-[#c9a76a] font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  <span>★</span>
                  <span>{{ (currentSuggestion.vote_average || 0).toFixed(1) }}</span>
                </span>
                <span v-if="currentSuggestion.release_date" class="text-bone-400">
                  {{ currentSuggestion.release_date.split('-')[0] }}
                </span>
                <span class="text-white/20">&bull;</span>
                <span class="text-[10px] uppercase font-bold text-[#E50914] bg-[#E50914]/15 px-2 py-0.5 rounded">
                  Movie
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-xl sm:text-2xl font-bold font-display text-white line-clamp-1 drop-shadow mb-2">
                {{ currentSuggestion.title }}
              </h2>

              <!-- Overview -->
              <p class="text-bone-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 font-normal">
                {{ currentSuggestion.overview || 'No description available for this title.' }}
              </p>

              <!-- Actions -->
              <div class="flex flex-wrap items-center gap-2.5">
                <!-- Play Now -->
                <button
                  @click="watchNow"
                  class="flex items-center gap-2 bg-[#E50914] hover:bg-[#FF1E27] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:scale-105 active:scale-95"
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
                  class="flex items-center gap-1.5 bg-surface-100 hover:bg-surface-200 text-[#f5efe4] hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-white/10 hover:border-white/25 active:scale-95 disabled:opacity-50"
                  title="Watch Trailer"
                >
                  <svg v-if="!loadingTrailer" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span v-else class="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#E50914] animate-spin"></span>
                  <span>Trailer</span>
                </button>

                <!-- Watchlist -->
                <button
                  @click="toggleList"
                  class="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border"
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
                  class="flex items-center gap-1.5 bg-surface-100 hover:bg-surface-200 text-bone-300 hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all border border-white/10 hover:border-white/20 active:scale-95 group"
                  title="Roll another suggestion"
                >
                  <span class="group-hover:rotate-180 transition-transform duration-300">🎲</span>
                  <span>Roll Another</span>
                </button>

                <!-- More Info -->
                <button
                  @click="viewDetails"
                  class="text-xs text-bone-400 hover:text-white px-3 py-2 transition-colors ml-auto underline-offset-4 hover:underline"
                >
                  More Info &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trailer Modal Inside Suggestion -->
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
import { backdrop, poster, getMovie } from '@/api/tmdb.js'
import { useRecommendation } from '@/composables/useRecommendation.js'
import { useWatchlist } from '@/composables/useWatchlist.js'
import TrailerModal from '@/components/TrailerModal.vue'

const router = useRouter()
const { isOpen, isLoading, currentSuggestion, rollAgain, closeSuggestion } = useRecommendation()
const { isInWatchlist, toggleWatchlist } = useWatchlist()

const showTrailer = ref(false)
const trailerKey = ref('')
const loadingTrailer = ref(false)

const isInList = computed(() => {
  if (!currentSuggestion.value) return false
  return isInWatchlist(currentSuggestion.value.id)
})

const toggleList = () => {
  if (currentSuggestion.value) {
    toggleWatchlist(currentSuggestion.value, 'movie')
  }
}

const watchNow = () => {
  if (!currentSuggestion.value) return
  const id = currentSuggestion.value.id
  closeSuggestion()
  router.push({ name: 'StreamMovie', params: { id } })
}

const openTrailer = async () => {
  if (!currentSuggestion.value) return
  if (trailerKey.value) {
    showTrailer.value = true
    return
  }
  loadingTrailer.value = true
  try {
    const details = await getMovie(currentSuggestion.value.id, { append_to_response: 'videos' })
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

const viewDetails = () => {
  if (!currentSuggestion.value) return
  const id = currentSuggestion.value.id
  closeSuggestion()
  router.push({ name: 'MovieDetail', params: { id } })
}

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
