<template>
  <div v-if="items && items.length > 0" class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.8)] animate-pulse"></span>
        <h2 class="text-xl md:text-2xl font-display tracking-wide uppercase text-white font-bold flex items-center gap-2">
          {{ title }}
        </h2>
      </div>
      <div class="flex items-center gap-1.5 text-xs text-bone-400 font-mono">
        <span class="text-[#E50914] font-bold">TOP 10</span>
        <span class="text-white/20">&bull;</span>
        <span>Today</span>
      </div>
    </div>

    <!-- Top 10 Horizontal Rail -->
    <div 
      class="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x select-none"
      ref="railRef"
    >
      <div 
        v-for="(item, index) in items.slice(0, 10)" 
        :key="item.id"
        class="flex-shrink-0 flex items-end snap-start group relative transition-transform duration-300 hover:scale-105 cursor-pointer"
        @click="goToPlay(item)"
      >
        <!-- Giant Typographic Rank Number (Netflix style) -->
        <div class="relative -mr-6 md:-mr-10 z-0 select-none pointer-events-none">
          <span 
            class="text-[90px] md:text-[140px] font-display font-black leading-none tracking-tighter text-transparent block"
            style="-webkit-text-stroke: 4px #34343f; text-shadow: 0 0 20px rgba(0,0,0,0.9);"
          >
            {{ index + 1 }}
          </span>
        </div>

        <!-- Poster Card -->
        <div class="w-32 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-surface-100 border border-white/10 group-hover:border-[#E50914] shadow-card group-hover:shadow-[0_0_25px_rgba(229,9,20,0.45)] relative z-10 transition-all duration-300">
          <img
            v-if="item.poster_path"
            :src="poster(item.poster_path, 'w342')"
            :alt="item.title || item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-surface-200 text-bone-400 text-xs text-center p-2">
            {{ item.title || item.name }}
          </div>

          <!-- Recently Added Badge -->
          <div 
            v-if="isRecentlyAdded(item)" 
            class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[9px] font-bold font-mono tracking-wider uppercase shadow-md"
          >
            Recently added
          </div>

          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <span class="text-xs font-bold text-white line-clamp-1 mb-1 font-sans">
              {{ item.title || item.name }}
            </span>
            <div class="flex items-center justify-between text-[11px] text-bone-300 font-mono">
              <span class="text-[#E50914] font-bold">★ {{ (item.vote_average || 0).toFixed(1) }}</span>
              <span class="w-6 h-6 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-md">
                ▶
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { poster } from '@/api/tmdb.js'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  mediaType: {
    type: String,
    default: 'movie'
  }
})

const router = useRouter()
const railRef = ref(null)

const isRecentlyAdded = (item) => {
  const dateStr = item.release_date || item.first_air_date
  if (!dateStr) return false
  const diffDays = (Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24)
  return diffDays < 90 && diffDays > -30
}

const goToPlay = (item) => {
  const type = item.media_type || props.mediaType
  if (type === 'tv') {
    router.push({ name: 'StreamTv', params: { id: item.id, season: 1, episode: 1 } })
  } else {
    router.push({ name: 'StreamMovie', params: { id: item.id } })
  }
}
</script>
