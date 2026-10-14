<template>
  <div class="px-4 md:px-8 pt-24 pb-16 min-h-screen">
    <div class="max-w-4xl mx-auto mb-10">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery" 
          @input="onSearchInput"
          ref="searchInput"
          type="text" 
          placeholder="Search for movies, TV shows, and people..." 
          class="w-full bg-surface-100 text-white rounded-full py-4 pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-accent text-base md:text-lg border border-surface-200"
        >
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="searchQuery" class="mb-8 flex overflow-x-auto no-scrollbar gap-2 pb-2">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="currentTab = tab.value"
        :class="[
          'px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors',
          currentTab === tab.value 
            ? 'bg-accent text-white shadow-md shadow-accent/20' 
            : 'bg-surface-100 text-gray-300 hover:bg-surface-200 hover:text-white'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading && results.length === 0" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!searchQuery" class="text-center py-20 text-gray-400 flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-40 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h2 class="text-xl font-bold text-white mb-2">Search Cineby</h2>
      <p class="text-sm">Find movies, TV series, and actors across our entire catalog</p>
    </div>
    
    <div v-else-if="filteredResults.length === 0" class="text-center py-20 text-gray-400">
      No results found for "{{ searchQuery }}"
    </div>

    <div v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <template v-for="item in filteredResults" :key="`${item.media_type}-${item.id}`">
          <PosterCard 
            v-if="item.media_type === 'movie' || item.media_type === 'tv'" 
            :item="item" 
          />
          <router-link 
            v-else-if="item.media_type === 'person'"
            :to="{ name: 'PersonDetail', params: { id: item.id } }"
            class="bg-surface-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-accent transition-all flex flex-col h-full border border-surface-200"
          >
            <div class="w-full aspect-[2/3] bg-surface-200">
              <img 
                v-if="item.profile_path" 
                :src="profile(item.profile_path, 'w500')" 
                :alt="item.name"
                class="w-full h-full object-cover"
                loading="lazy"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="p-3 flex flex-col flex-grow">
              <h3 class="font-bold text-sm md:text-base line-clamp-1 text-white">{{ item.name }}</h3>
              <p class="text-xs text-gray-400 mt-1 line-clamp-2">
                {{ item.known_for_department }} &bull; {{ item.known_for?.map(k => k.title || k.name).join(', ') }}
              </p>
            </div>
          </router-link>
        </template>
      </div>
      
      <div v-if="hasMore" ref="sentinel" class="h-14 mt-8 flex justify-center items-center">
        <div v-if="loading" class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PosterCard from '@/components/PosterCard.vue'
import { searchMulti, profile } from '@/api/tmdb.js'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll.js'

const route = useRoute()
const router = useRouter()

const searchInput = ref(null)
const searchQuery = ref('')
const results = ref([])
const loading = ref(false)
const hasMore = ref(false)
const page = ref(1)
const currentTab = ref('all')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' },
  { label: 'People', value: 'person' }
]

const filteredResults = computed(() => {
  if (currentTab.value === 'all') {
    return results.value
  }
  return results.value.filter(item => item.media_type === currentTab.value)
})

let searchTimeout = null

const performSearch = async (isLoadMore = false) => {
  if (!searchQuery.value.trim()) {
    results.value = []
    hasMore.value = false
    return
  }

  if (isLoadMore) {
    page.value++
  } else {
    page.value = 1
    results.value = []
    // Sync URL query without reloading
    if (route.query.q !== searchQuery.value) {
      router.replace({ query: { ...route.query, q: searchQuery.value } }).catch(() => {})
    }
  }

  loading.value = true
  try {
    const data = await searchMulti(searchQuery.value, page.value)
    const newItems = data.results || []
    if (isLoadMore) {
      results.value = [...results.value, ...newItems]
    } else {
      results.value = newItems
    }
    hasMore.value = page.value < data.total_pages
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

const onSearchInput = () => {
  clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    results.value = []
    loading.value = false
    router.replace({ query: {} }).catch(() => {})
    return
  }
  
  loading.value = true
  searchTimeout = setTimeout(() => {
    performSearch(false)
  }, 350)
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  router.replace({ query: {} }).catch(() => {})
  searchInput.value?.focus()
}

const { sentinel } = useInfiniteScroll(() => {
  if (!loading.value && hasMore.value && searchQuery.value) {
    performSearch(true)
  }
})

watch(() => route.query.q, (newQ) => {
  if (newQ && newQ !== searchQuery.value) {
    searchQuery.value = newQ
    performSearch(false)
  }
})

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = String(route.query.q)
    performSearch(false)
  }
  searchInput.value?.focus()
})
</script>
