<template>
  <div class="tv-detail pb-20">
    <div v-if="loading" class="animate-pulse">
      <div class="w-full h-[50vh] md:h-[70vh] bg-surface-200"></div>
      <div class="container mx-auto px-4 mt-8">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-48 md:w-64 h-72 md:h-96 bg-surface-200 rounded-lg hidden md:block"></div>
          <div class="flex-1 space-y-4">
            <div class="h-10 bg-surface-200 rounded w-1/2"></div>
            <div class="h-6 bg-surface-200 rounded w-1/4"></div>
            <div class="h-24 bg-surface-200 rounded w-full mt-8"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="tv" class="content">
      <!-- Backdrop -->
      <div class="relative w-full h-[50vh] md:h-[70vh]">
        <img 
          :src="backdrop(tv.backdrop_path, 'original')" 
          :alt="tv.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full p-4 md:p-8 container mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-end md:items-start translate-y-1/4 md:translate-y-1/4 z-10">
          <img 
            :src="poster(tv.poster_path, 'w500')" 
            :alt="tv.name"
            class="w-32 md:w-64 rounded-xl shadow-2xl poster-card hidden md:block"
          />
        </div>
      </div>
      
      <!-- TV Info -->
      <div class="container mx-auto px-4 mt-8 md:mt-32 relative z-20">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-32 md:w-64 flex-shrink-0 md:hidden">
             <img 
              :src="poster(tv.poster_path, 'w500')" 
              :alt="tv.name"
              class="w-full rounded-xl shadow-2xl poster-card"
            />
          </div>
          
          <div class="flex-1">
            <h1 class="text-3xl md:text-5xl font-bold text-white mb-2">{{ tv.name }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6">
              <span>{{ getYear(tv.first_air_date) }}</span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                {{ tv.number_of_seasons }} {{ tv.number_of_seasons === 1 ? 'Season' : 'Seasons' }}
              </span>
              <span class="flex items-center gap-1 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {{ tv.vote_average?.toFixed(1) }}
              </span>
              <span class="px-2 py-1 bg-surface-100 rounded text-xs" v-for="genre in tv.genres" :key="genre.id">
                {{ genre.name }}
              </span>
              <span class="px-2 py-1 border border-surface-100 rounded text-xs">
                {{ tv.status }}
              </span>
            </div>
            
            <p class="text-gray-300 leading-relaxed mb-8 max-w-3xl">{{ tv.overview }}</p>
            
            <div class="flex flex-wrap items-center gap-4">
              <router-link 
                :to="{ name: 'StreamTv', params: { id: tv.id, season: 1, episode: 1 } }"
                class="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                Watch Now
              </router-link>
              
              <button 
                @click="handleToggleWatchlist"
                class="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 border"
                :class="inWatchlist 
                  ? 'bg-[#E50914] hover:bg-[#FF1E27] text-white border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.4)]' 
                  : 'bg-surface-100 hover:bg-surface-200 text-white border-white/10 hover:border-white/20'"
              >
                <svg v-if="inWatchlist" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ inWatchlist ? 'In My List' : 'Add to My List' }}
              </button>
              
              <button 
                v-if="trailerKey"
                @click="showTrailer = true"
                class="flex items-center gap-2 bg-surface-100 hover:bg-surface-200 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 border border-white/10 hover:border-white/25"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Trailer
              </button>

              <button 
                @click="scrollToMoreLikeThis"
                class="flex items-center gap-2 bg-surface-100 hover:bg-surface-200 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 border border-white/10 hover:border-white/25"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-bone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                More Like This
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cast -->
      <div v-if="cast.length > 0" class="container mx-auto px-4 mt-16">
        <h2 class="text-2xl font-bold text-white mb-6">Cast</h2>
        <div class="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          <CastCard v-for="person in cast" :key="person.id" :person="person" class="flex-shrink-0 w-32" />
        </div>
      </div>
      
      <!-- More Like This / Similar -->
      <div id="more-like-this" class="scroll-mt-24">
        <div v-if="tv.similar?.results?.length > 0" class="container mx-auto px-4 mt-12">
          <ContentRail title="More Like This" :items="tv.similar.results" />
        </div>
        
        <!-- Recommended -->
        <div v-if="tv.recommendations?.results?.length > 0" class="container mx-auto px-4 mt-12">
          <ContentRail title="Recommended For You" :items="tv.recommendations.results" />
        </div>
      </div>
    </div>
    
    <TrailerModal 
      v-if="showTrailer" 
      :trailerKey="trailerKey" 
      :show="showTrailer"
      @close="showTrailer = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getTvShow, poster, backdrop } from '@/api/tmdb.js'
import { useWatchlist } from '@/composables/useWatchlist.js'
import CastCard from '@/components/CastCard.vue'
import ContentRail from '@/components/ContentRail.vue'
import TrailerModal from '@/components/TrailerModal.vue'

const route = useRoute()
const { isInWatchlist, toggleWatchlist } = useWatchlist()

const tv = ref(null)
const loading = ref(true)
const showTrailer = ref(false)

const inWatchlist = computed(() => {
  if (!tv.value) return false
  return isInWatchlist(tv.value.id)
})

const handleToggleWatchlist = () => {
  if (tv.value) {
    toggleWatchlist(tv.value, 'tv')
  }
}

const scrollToMoreLikeThis = () => {
  const el = document.getElementById('more-like-this')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const cast = computed(() => {
  return tv.value?.credits?.cast?.slice(0, 15) || []
})

const trailerKey = computed(() => {
  const videos = tv.value?.videos?.results || []
  if (!videos.length) return null
  const yt = videos.filter(v => v.site?.toLowerCase() === 'youtube' && v.key)
  const officialTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer' && v.official)
  if (officialTrailer) return officialTrailer.key
  const anyTrailer = yt.find(v => v.type?.toLowerCase() === 'trailer')
  if (anyTrailer) return anyTrailer.key
  const teaser = yt.find(v => v.type?.toLowerCase() === 'teaser')
  if (teaser) return teaser.key
  const clip = yt.find(v => v.type?.toLowerCase() === 'clip')
  if (clip) return clip.key
  return yt[0]?.key || null
})

const fetchTvShow = async (id) => {
  loading.value = true
  try {
    tv.value = await getTvShow(id, { append_to_response: 'credits,videos,similar,recommendations' })
  } catch (error) {
    console.error('Error fetching TV show:', error)
  } finally {
    loading.value = false
  }
}

const getYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

watch(() => route.params.id, (newId) => {
  if (newId) fetchTvShow(newId)
})

onMounted(() => {
  fetchTvShow(route.params.id)
})
</script>
