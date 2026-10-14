<template>
  <div class="min-h-screen pb-24 lg:pb-16 pt-20 px-4 md:px-8 max-w-7xl mx-auto">
    <!-- Back to Home link -->
    <div class="mb-4">
      <router-link to="/" class="inline-flex items-center gap-1.5 text-xs text-bone-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </router-link>
    </div>

    <!-- Platform Hero Header -->
    <div
      v-if="currentPlatform"
      class="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
      :style="{ background: `linear-gradient(135deg, ${currentPlatform.accent} 0%, #0c0c0e 85%)` }"
    >
      <!-- Radial highlight -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>

      <div class="relative z-10 flex items-center gap-5">
        <div class="h-16 w-32 md:h-20 md:w-40 relative flex items-center justify-center p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shrink-0">
          <img
            :src="currentPlatform.local_logo_path"
            :alt="currentPlatform.provider_name"
            :class="[
              'max-h-full max-w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
              currentPlatform.invertLogo ? 'brightness-0 invert' : ''
            ]"
          />
        </div>
        <div>
          <span class="text-xs uppercase font-mono tracking-widest text-[#E50914] font-bold">Studio Hub</span>
          <h1 class="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {{ currentPlatform.provider_name }}
          </h1>
          <p class="text-xs md:text-sm text-bone-300 mt-1">
            Browse original movies & series streaming on {{ currentPlatform.provider_name }}
          </p>
        </div>
      </div>

      <!-- Media Type Toggle (Movies vs TV Shows) -->
      <div class="relative z-10 flex items-center bg-black/50 p-1 rounded-xl border border-white/10 self-start md:self-auto shrink-0">
        <button
          @click="switchType('movie')"
          :class="[
            'px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer',
            activeType === 'movie'
              ? 'bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.5)]'
              : 'text-bone-400 hover:text-white'
          ]"
        >
          Movies
        </button>
        <button
          @click="switchType('tv')"
          :class="[
            'px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer',
            activeType === 'tv'
              ? 'bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.5)]'
              : 'text-bone-400 hover:text-white'
          ]"
        >
          TV Shows
        </button>
      </div>
    </div>

    <!-- Content Grid -->
    <div v-if="loading && items.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
      <div v-for="i in 12" :key="i" class="aspect-[2/3] bg-surface-200 rounded-xl"></div>
    </div>

    <div v-else-if="items.length > 0" class="space-y-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <PosterCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :media-type="activeType"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="flex justify-center pt-4">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-8 py-3 bg-surface-200 hover:bg-surface-300 text-white font-bold text-xs md:text-sm rounded-full transition-all border border-white/10 hover:border-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {{ loadingMore ? 'Loading titles...' : 'Load More Titles' }}
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-surface-100 rounded-2xl border border-white/8">
      <p class="text-bone-400 text-sm">No titles found for this platform currently.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CURATED_STREAMING_PLATFORMS, getPlatformTitles } from '@/api/tmdb.js'
import PosterCard from '@/components/PosterCard.vue'

const route = useRoute()
const router = useRouter()

const providerId = computed(() => parseInt(route.params.id) || 8)
const activeType = ref(route.params.type === 'tv' ? 'tv' : 'movie')

const currentPlatform = computed(() => {
  return CURATED_STREAMING_PLATFORMS.find(p => p.provider_id === providerId.value) || CURATED_STREAMING_PLATFORMS[0]
})

const items = ref([])
const page = ref(1)
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)

const fetchTitles = async (isNew = false) => {
  if (isNew) {
    page.value = 1
    items.value = []
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const data = await getPlatformTitles(providerId.value, activeType.value, page.value)
    const newResults = data.results || []
    if (isNew) {
      items.value = newResults
    } else {
      items.value.push(...newResults)
    }
    hasMore.value = page.value < (data.total_pages || 1)
  } catch (err) {
    console.error('Failed to load platform titles:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const switchType = (type) => {
  if (activeType.value === type) return
  activeType.value = type
  router.replace(`/platforms/${providerId.value}/${type}`)
}

const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  page.value++
  fetchTitles(false)
}

watch([() => route.params.id, () => route.params.type], () => {
  activeType.value = route.params.type === 'tv' ? 'tv' : 'movie'
  fetchTitles(true)
})

onMounted(() => {
  fetchTitles(true)
})
</script>
