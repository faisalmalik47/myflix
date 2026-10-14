<template>
  <div class="px-4 md:px-8 pt-24 pb-16 min-h-screen">
    <h1 class="text-3xl font-bold mb-8">My Watchlist</h1>

    <div v-if="watchlist.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-2">Your watchlist is empty</h2>
      <p class="text-surface-400 max-w-md">Browse movies and TV shows to add them</p>
      <div class="mt-8 flex gap-4">
        <router-link :to="{ name: 'Movies' }" class="px-6 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full transition-colors">
          Browse Movies
        </router-link>
        <router-link :to="{ name: 'TvShows' }" class="px-6 py-2 bg-surface-100 hover:bg-surface-200 text-white font-medium rounded-full transition-colors">
          Browse TV Shows
        </router-link>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      <div v-for="item in watchlist" :key="item.id" class="relative group">
        <PosterCard :item="item" />
        <button 
          @click.prevent="removeFromWatchlist(item.id)"
          class="absolute top-2 right-2 bg-surface-300/80 hover:bg-accent text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm z-20"
          title="Remove from watchlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PosterCard from '@/components/PosterCard.vue'
import { useWatchlist } from '@/composables/useWatchlist.js'

const { getWatchlist, removeFromWatchlist } = useWatchlist()

const watchlist = computed(() => getWatchlist())
</script>
