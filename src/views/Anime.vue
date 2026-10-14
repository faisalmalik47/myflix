<template>
  <div class="px-4 md:px-8 pt-24 pb-16 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <span class="w-3 h-3 rounded-full bg-[#E50914] shadow-[0_0_12px_rgba(229,9,20,0.8)] animate-pulse"></span>
        <h1 class="text-3xl md:text-5xl font-display font-black text-white tracking-wider uppercase">
          Anime Hub
        </h1>
      </div>
      <p class="text-xs md:text-sm text-bone-400 max-w-xl">
        Stream the latest subbed and dubbed anime series and movies in full HD with ultra-low latency.
      </p>
    </div>

    <!-- Category Tabs -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer',
          activeTab === tab.id
            ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]'
            : 'bg-surface-100 text-bone-400 hover:text-white hover:bg-surface-200'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      <div v-for="i in 18" :key="i" class="aspect-[2/3] rounded-xl bg-surface-100 animate-pulse"></div>
    </div>

    <!-- Anime Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      <PosterCard
        v-for="item in animeList"
        :key="item.id"
        :item="{ ...item, media_type: activeTab === 'movies' ? 'movie' : 'tv' }"
      />
    </div>

    <!-- Infinite Scroll Sentinel -->
    <div ref="sentinel" class="h-16 flex items-center justify-center mt-6">
      <div v-if="loadingMore" class="w-6 h-6 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import PosterCard from '@/components/PosterCard.vue'
import { getTrendingAnime, getTopRatedAnime, getAnimeMovies } from '@/api/tmdb.js'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll.js'

const tabs = [
  { id: 'trending', name: '🔥 Trending Anime' },
  { id: 'top_rated', name: '★ Top Rated Series' },
  { id: 'movies', name: '🎬 Anime Films' }
]

const activeTab = ref('trending')
const animeList = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const page = ref(1)
const totalPages = ref(1)

const fetchAnime = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    page.value = 1
    animeList.value = []
  }

  try {
    let data
    if (activeTab.value === 'trending') {
      data = await getTrendingAnime(page.value)
    } else if (activeTab.value === 'top_rated') {
      data = await getTopRatedAnime(page.value)
    } else {
      data = await getAnimeMovies(page.value)
    }

    const items = data.results || []
    if (isLoadMore) {
      animeList.value = [...animeList.value, ...items]
    } else {
      animeList.value = items
    }
    totalPages.value = data.total_pages || 1
  } catch (err) {
    console.error('Failed to fetch anime:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

watch(activeTab, () => {
  fetchAnime(false)
})

const { sentinel } = useInfiniteScroll(() => {
  if (!loading.value && !loadingMore.value && page.value < totalPages.value) {
    page.value++
    fetchAnime(true)
  }
})

onMounted(() => {
  fetchAnime(false)
})
</script>
