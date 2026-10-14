<template>
  <div class="px-4 md:px-8 pt-24 pb-16 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-white mb-6">Explore TV Shows</h1>
      <FilterPanel :genres="genres" v-model="filters" />
    </div>

    <div v-if="loading && items.length === 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      <div v-for="i in 10" :key="i" class="w-full aspect-[2/3] bg-surface-100 rounded-lg animate-pulse"></div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <PosterCard 
          v-for="item in items" 
          :key="item.id" 
          :item="item" 
        />
      </div>
      
      <div v-if="items.length === 0" class="text-center py-20 text-gray-400">
        No TV shows found matching your filters.
      </div>
      
      <div v-if="hasMore" ref="sentinel" class="h-14 mt-8 flex justify-center items-center">
        <div v-if="loading" class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import PosterCard from '@/components/PosterCard.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { discoverTv, getTvGenres } from '@/api/tmdb.js'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll.js'

const genres = ref([])
const items = ref([])
const loading = ref(true)
const hasMore = ref(true)
const page = ref(1)

const filters = ref({
  genre: null,
  sort: 'popularity.desc'
})

const fetchTvShows = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (!hasMore.value) return
    page.value++
  } else {
    page.value = 1
    items.value = []
    hasMore.value = true
  }

  loading.value = true
  try {
    const params = {
      page: page.value,
      sort_by: filters.value.sort
    }
    if (filters.value.genre) {
      params.with_genres = filters.value.genre
    }

    const data = await discoverTv(params)
    const newItems = (data.results || []).map(item => ({ ...item, media_type: 'tv' }))
    
    if (isLoadMore) {
      items.value = [...items.value, ...newItems]
    } else {
      items.value = newItems
    }
    
    hasMore.value = page.value < data.total_pages
  } catch (error) {
    console.error('Error fetching TV shows:', error)
  } finally {
    loading.value = false
  }
}

const { sentinel } = useInfiniteScroll(() => {
  if (!loading.value && hasMore.value) {
    fetchTvShows(true)
  }
})

watch(filters, () => {
  fetchTvShows(false)
}, { deep: true })

onMounted(async () => {
  try {
    const genresData = await getTvGenres()
    genres.value = genresData || []
  } catch (error) {
    console.error('Error fetching TV genres:', error)
  }
  fetchTvShows(false)
})
</script>
