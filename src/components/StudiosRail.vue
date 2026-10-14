<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.8)]"></span>
        <h2 class="text-xl md:text-2xl font-display tracking-wide uppercase text-white font-bold">
          Studios & Platforms
        </h2>
      </div>
      <span class="text-xs text-bone-400 font-mono">Stream by Network</span>
    </div>

    <!-- Studios Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
      <button
        v-for="studio in studios"
        :key="studio.id"
        @click="selectStudio(studio)"
        :class="[
          'relative p-3.5 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 group overflow-hidden cursor-pointer active:scale-95 shadow-md',
          activeStudioId === studio.id
            ? 'bg-gradient-to-b from-[#E50914]/20 to-surface-200 border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.4)]'
            : 'bg-surface-100 hover:bg-surface-200 border-white/8 hover:border-white/20 hover:-translate-y-0.5'
        ]"
      >
        <!-- Ambient background glow -->
        <div 
          class="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
          :style="{ backgroundColor: studio.color }"
        ></div>

        <!-- Studio Brand Logo / Text -->
        <div class="relative z-10 flex flex-col items-center">
          <span 
            class="font-display text-base sm:text-lg font-black tracking-wider uppercase text-white group-hover:scale-105 transition-transform"
            :style="{ textShadow: `0 0 15px ${studio.color}80` }"
          >
            {{ studio.name }}
          </span>
          <span class="text-[10px] text-bone-400 font-mono tracking-tight">
            Originals
          </span>
        </div>

        <!-- Active indicator -->
        <span 
          v-if="activeStudioId === studio.id" 
          class="w-1.5 h-1.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] absolute bottom-1.5"
        ></span>
      </button>
    </div>

    <!-- Studio Selected Content Modal / Expansion -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="selectedStudio && studioTitles.length > 0"
        class="mt-4 p-4 md:p-6 rounded-2xl bg-surface-100 border border-white/10 shadow-2xl relative"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-bold">
              {{ selectedStudio.name }} Originals
            </span>
            <span class="text-xs text-bone-400">Top titles available to stream</span>
          </div>
          <button 
            @click="clearSelection" 
            class="text-xs text-bone-400 hover:text-white px-2.5 py-1 rounded-lg bg-surface-200 hover:bg-surface-300 transition-colors"
          >
            Close &times;
          </button>
        </div>

        <!-- Titles Row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div 
            v-for="item in studioTitles.slice(0, 6)"
            :key="item.id"
            @click="goToPlay(item)"
            class="group cursor-pointer rounded-xl overflow-hidden bg-surface-200 border border-white/8 hover:border-[#E50914] transition-all hover:scale-105"
          >
            <div class="aspect-[2/3] w-full relative">
              <img 
                v-if="item.poster_path"
                :src="poster(item.poster_path, 'w342')"
                :alt="item.title || item.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-xs font-bold text-white line-clamp-1">▶ Watch</span>
              </div>
            </div>
            <div class="p-2">
              <h4 class="text-xs font-bold text-white truncate">{{ item.title || item.name }}</h4>
              <span class="text-[10px] text-[#E50914] font-mono font-bold">★ {{ (item.vote_average || 0).toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { STUDIOS, getStudioTitles, poster } from '@/api/tmdb.js'

const router = useRouter()
const studios = STUDIOS
const activeStudioId = ref('')
const selectedStudio = ref(null)
const studioTitles = ref([])
const loading = ref(false)

const selectStudio = async (studio) => {
  if (activeStudioId.value === studio.id) {
    clearSelection()
    return
  }

  activeStudioId.value = studio.id
  selectedStudio.value = studio
  loading.value = true

  try {
    const data = await getStudioTitles(studio)
    studioTitles.value = data.results || []
  } catch (e) {
    console.error('Failed to load studio titles:', e)
  } finally {
    loading.value = false
  }
}

const clearSelection = () => {
  activeStudioId.value = ''
  selectedStudio.value = null
  studioTitles.value = []
}

const goToPlay = (item) => {
  const type = item.title ? 'movie' : 'tv'
  if (type === 'tv') {
    router.push({ name: 'StreamTv', params: { id: item.id, season: 1, episode: 1 } })
  } else {
    router.push({ name: 'StreamMovie', params: { id: item.id } })
  }
}
</script>
