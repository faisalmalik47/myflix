<template>
  <div v-if="item" class="relative w-full h-[70vh] md:h-[85vh] min-h-[500px] bg-surface flex items-center overflow-hidden">
    <!-- Background Image with Multi-layer Cinematic Vignette -->
    <div class="absolute inset-0 select-none pointer-events-none">
      <img
        :src="backdrop(item.backdrop_path, 'original')"
        :alt="item.title || item.name"
        class="w-full h-full object-cover scale-105 transform motion-safe:animate-pulse transition-transform duration-1000"
        @error="handleImageError"
      />
      <div class="absolute inset-0 cinematic-fade-b"></div>
      <div class="absolute inset-0 cinematic-fade-r"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/60"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 md:px-8 relative z-10 pt-20">
      <div class="max-w-2xl text-left space-y-4">
        
        <!-- Metadata Pill Badges -->
        <div class="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-100/90 backdrop-blur-md border border-white/10 text-xs">
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
        <h1 class="text-4xl md:text-7xl font-display font-black text-white tracking-wide uppercase leading-none drop-shadow-2xl">
          {{ item.title || item.name }}
        </h1>
        
        <!-- Overview -->
        <p class="text-bone-300 text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow max-w-xl font-normal">
          {{ item.overview }}
        </p>

        <!-- CTAs -->
        <div class="flex items-center gap-3.5 pt-2">
          <router-link
            :to="streamRoute"
            class="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#E50914] to-[#FF1E27] hover:brightness-110 text-white px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(229,9,20,0.5)] transform hover:-translate-y-0.5 active:scale-95"
          >
            <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current ml-0.5 text-white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>Watch Now</span>
          </router-link>
          
          <router-link
            :to="detailRoute"
            class="inline-flex items-center gap-2 bg-surface-100/90 hover:bg-surface-200 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border border-white/10 hover:border-white/25 transform hover:-translate-y-0.5 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-bone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Overview</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-[70vh] md:h-[85vh] min-h-[500px] bg-surface-100 skeleton-shimmer flex items-center justify-center">
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { backdrop } from '@/api/tmdb.js'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const defaultMediaType = computed(() => {
  if (!props.item) return 'movie'
  return props.item.name && !props.item.title ? 'tv' : 'movie'
})

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
