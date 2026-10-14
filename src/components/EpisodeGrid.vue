<template>
  <div class="episode-grid">
    <!-- Season Selector -->
    <div class="mb-6 flex items-center space-x-3">
      <label class="text-xs font-mono font-medium text-[#8a8270] uppercase tracking-wider">Season:</label>
      <div class="relative">
        <select
          v-model="selectedSeasonNumber"
          @change="loadSeason"
          class="bg-[#13110e] text-[#f5efe4] text-xs font-semibold border border-[#f5efe4]/10 rounded-xl py-2 pl-3.5 pr-8 appearance-none focus:outline-none focus:border-[#E50914] cursor-pointer min-w-[140px] shadow-sm font-sans"
        >
          <option 
            v-for="season in validSeasons" 
            :key="season.id" 
            :value="season.season_number"
            class="bg-[#13110e] text-[#f5efe4]"
          >
            {{ season.name || `Season ${season.season_number}` }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8a8270]">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Episodes Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="bg-[#13110e] rounded-xl overflow-hidden border border-[#f5efe4]/5">
        <div class="aspect-video bg-[#1c1915] animate-pulse"></div>
        <div class="p-3.5 space-y-2">
          <div class="h-3 bg-[#1c1915] rounded w-1/4"></div>
          <div class="h-4 bg-[#1c1915] rounded w-3/4"></div>
          <div class="h-2.5 bg-[#1c1915] rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Episodes Grid -->
    <div v-else-if="episodes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="episode in episodes"
        :key="episode.id"
        @click="selectEpisode(episode)"
        :class="[
          'bg-[#13110e] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border',
          isCurrentEpisode(episode) 
            ? 'border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.25)] ring-1 ring-[#E50914]/50 bg-[#1c1915]' 
            : 'border-[#f5efe4]/8 hover:border-[#f5efe4]/20 hover:bg-[#1c1915]'
        ]"
      >
        <!-- Still Image -->
        <div class="aspect-video relative bg-[#0b0a08] overflow-hidden">
          <img
            v-if="episode.still_path"
            :src="backdrop(episode.still_path, 'w300')"
            :alt="episode.name"
            class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-[#1c1915] text-[#8a8270]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div class="absolute top-2.5 right-2.5 bg-[#0b0a08]/80 backdrop-blur-md text-[#f5efe4] px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-[#f5efe4]/10">
            EP {{ episode.episode_number }}
          </div>
          
          <!-- Play icon overlay -->
          <div class="absolute inset-0 bg-[#0b0a08]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="w-10 h-10 rounded-full bg-[#E50914] text-[#0b0a08] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current ml-0.5" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <!-- Active episode accent bar -->
          <div v-if="isCurrentEpisode(episode)" class="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]"></div>
        </div>
        
        <!-- Info -->
        <div class="p-3.5">
          <div class="text-[10px] text-[#E50914] font-mono font-semibold uppercase tracking-wider mb-1">
            Season {{ episode.season_number }} &bull; Episode {{ episode.episode_number }}
          </div>
          <h4 class="text-[#f5efe4] font-display font-medium text-xs sm:text-sm line-clamp-1 mb-1 group-hover:text-[#E50914] transition-colors" :title="episode.name">
            {{ episode.name }}
          </h4>
          <div class="flex justify-between items-center text-[11px] text-[#8a8270] mt-2 font-mono">
            <span>{{ episode.air_date ? new Date(episode.air_date).toLocaleDateString() : 'TBA' }}</span>
            <span class="flex items-center text-[#c9a76a] font-semibold text-[10px]">
              ★ {{ (episode.vote_average || 0).toFixed(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12 text-gray-500 text-xs">
      No episodes available for this season.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getSeason, backdrop } from '@/api/tmdb.js'

const props = defineProps({
  seasons: {
    type: Array,
    required: true
  },
  currentSeason: {
    type: Number,
    required: true
  },
  currentEpisode: {
    type: Number,
    required: true
  },
  tvId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['select'])

const selectedSeasonNumber = ref(props.currentSeason)
const episodes = ref([])
const loading = ref(false)

const validSeasons = computed(() => {
  return props.seasons.filter(s => s.season_number > 0)
})

const loadSeason = async () => {
  loading.value = true
  try {
    const data = await getSeason(props.tvId, selectedSeasonNumber.value)
    episodes.value = data.episodes || []
  } catch (error) {
    console.error("Error loading season episodes:", error)
    episodes.value = []
  } finally {
    loading.value = false
  }
}

const selectEpisode = (episode) => {
  emit('select', episode.season_number, episode.episode_number)
}

const isCurrentEpisode = (episode) => {
  return episode.season_number === parseInt(props.currentSeason) && 
         episode.episode_number === parseInt(props.currentEpisode)
}

watch(() => props.currentSeason, (newVal) => {
  if (parseInt(newVal) !== parseInt(selectedSeasonNumber.value)) {
    selectedSeasonNumber.value = newVal
    loadSeason()
  }
})

onMounted(() => {
  if (validSeasons.value.length > 0 && !selectedSeasonNumber.value) {
    selectedSeasonNumber.value = validSeasons.value[0].season_number
  }
  loadSeason()
})
</script>
