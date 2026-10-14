<template>
  <div class="px-4 md:px-8 pt-24 pb-16 min-h-screen">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl md:text-4xl font-display font-black text-white tracking-wide">My List</h1>
        <span class="px-2.5 py-0.5 rounded-full bg-[#E50914]/20 border border-[#E50914]/30 text-[#E50914] text-xs font-mono font-bold">
          {{ filteredList.length }}
        </span>

        <button
          @click="openSuggestion"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#f5efe4] hover:text-white bg-white/5 hover:bg-[#E50914]/20 border border-white/10 hover:border-[#E50914]/50 transition-all duration-200 group ml-2 shadow-sm"
          title="Get a random movie recommendation based on your watch history"
        >
          <span class="group-hover:rotate-180 transition-transform duration-500">🎲</span>
          <span>Surprise Me</span>
        </button>
      </div>

      <!-- Filter tabs -->
      <div v-if="watchlist.length > 0" class="flex items-center gap-1.5 p-1 bg-surface-100 rounded-full border border-white/10 text-xs self-start md:self-auto">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-4 py-1.5 rounded-full font-semibold transition-all duration-200',
            activeTab === tab.value
              ? 'bg-[#E50914] text-white shadow-sm'
              : 'text-bone-400 hover:text-white'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-20 h-20 bg-surface-100/80 rounded-2xl border border-white/10 flex items-center justify-center mb-6 text-[#E50914] shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2 font-display">
        {{ watchlist.length === 0 ? 'Your List is Empty' : 'No titles match this filter' }}
      </h2>
      <p class="text-bone-400 max-w-md text-sm mb-8">
        {{ watchlist.length === 0 ? 'Explore movies, shows, and anime and tap the heart icon to save them to your list.' : 'Try selecting "All" to view your entire watchlist.' }}
      </p>
      <div class="flex flex-wrap gap-3 justify-center">
        <router-link :to="{ name: 'Movies' }" class="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1E27] text-white text-xs font-bold rounded-full transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]">
          Explore Movies
        </router-link>
        <router-link :to="{ name: 'TvShows' }" class="px-6 py-2.5 bg-surface-100 hover:bg-surface-200 text-white text-xs font-semibold rounded-full border border-white/10 transition-colors">
          Explore TV Shows
        </router-link>
      </div>
    </div>
    
    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-5">
      <div v-for="item in filteredList" :key="item.id" class="relative group">
        <PosterCard :item="item" />
        <button 
          @click.stop.prevent="removeFromWatchlist(item.id)"
          class="absolute top-2 right-2 bg-black/80 hover:bg-[#E50914] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-md z-30 border border-white/10 hover:scale-110 active:scale-95"
          title="Remove from My List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PosterCard from '@/components/PosterCard.vue'
import { useWatchlist } from '@/composables/useWatchlist.js'
import { useRecommendation } from '@/composables/useRecommendation.js'

const { items, removeFromWatchlist } = useWatchlist()
const { openSuggestion } = useRecommendation()

const activeTab = ref('all')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' },
]

const watchlist = computed(() => items.value)

const filteredList = computed(() => {
  if (activeTab.value === 'all') return watchlist.value
  return watchlist.value.filter(item => {
    const type = item.media_type || (item.title ? 'movie' : 'tv')
    return type === activeTab.value
  })
})
</script>

