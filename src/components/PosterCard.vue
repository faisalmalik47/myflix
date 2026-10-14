<template>
  <div class="poster-card relative group cursor-pointer aspect-[2/3] rounded-xl overflow-hidden glass-card border border-white/5 select-none">
    <!-- Image with skeleton shimmer loading state -->
    <img
      v-if="item.poster_path"
      :src="poster(item.poster_path, 'w500')"
      :alt="item.title || item.name"
      class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      @load="imageLoaded = true"
      :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
      loading="lazy"
    />
    <div v-if="!imageLoaded" class="absolute inset-0 skeleton-shimmer"></div>

    <!-- Rating Badge -->
    <div class="absolute top-2.5 right-2.5 bg-[#0b0a08]/80 backdrop-blur-md text-[#f5efe4] px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center z-10 border border-[#f5efe4]/10 shadow-sm">
      <span class="text-[#c9a76a] mr-1">★</span>
      <span class="text-[#c9a76a]">{{ (item.vote_average || 0).toFixed(1) }}</span>
    </div>

    <!-- Quick Watchlist Button -->
    <button 
      @click.stop="toggle" 
      class="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-[#0b0a08]/80 backdrop-blur-md hover:bg-[#0b0a08] transition-all z-20 border border-[#f5efe4]/10 hover:scale-110 active:scale-95"
      :title="isInList ? 'Remove from Watchlist' : 'Add to Watchlist'"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        :class="['h-4 w-4 transition-colors', isInList ? 'text-[#E50914] fill-[#E50914]' : 'text-[#f5efe4]/80 hover:text-[#f5efe4]']" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        :fill="isInList ? 'currentColor' : 'none'"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <!-- Sleek Gradient Overlay On Hover -->
    <div 
      class="absolute inset-0 bg-gradient-to-t from-[#0b0a08]/95 via-[#0b0a08]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-10" 
      @click="navigate"
    >
      <!-- Media Type Chip -->
      <span class="text-[9px] uppercase tracking-wider font-mono font-bold text-[#E50914] mb-1">
        {{ itemType === 'tv' ? 'TV Show' : 'Movie' }}
      </span>

      <!-- Title -->
      <h3 class="text-[#f5efe4] font-display font-medium text-sm line-clamp-2 leading-tight mb-1 group-hover:text-[#E50914] transition-colors">
        {{ item.title || item.name }}
      </h3>
      
      <!-- Year -->
      <div class="text-[#8a8270] text-xs font-mono flex items-center justify-between">
        <span>{{ (item.release_date || item.first_air_date || '').split('-')[0] }}</span>
        <span class="inline-flex items-center text-[10px] text-[#E50914] font-semibold group-hover:translate-x-0.5 transition-transform">
          Play &rarr;
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { poster } from '@/api/tmdb.js'
import { useWatchlist } from '@/composables/useWatchlist.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { isInWatchlist, toggleWatchlist } = useWatchlist()
const imageLoaded = ref(false)

const itemType = computed(() => props.item.media_type || (props.item.name ? 'tv' : 'movie'))
const isInList = computed(() => isInWatchlist(props.item, itemType.value))

const toggle = () => {
  toggleWatchlist(props.item, itemType.value)
}

const navigate = () => {
  if (itemType.value === 'movie') {
    router.push(`/movie/${props.item.id}`)
  } else {
    router.push(`/tv/${props.item.id}`)
  }
}
</script>
