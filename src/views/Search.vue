<template>
  <div class="px-4 md:px-8 pt-24 pb-24 min-h-screen">
    <!-- Search Bar (Netflix iOS Style with Cancel button) -->
    <div class="max-w-4xl mx-auto mb-6">
      <div class="flex items-center gap-3">
        <div class="relative flex-1 flex items-center bg-[#25252b] rounded-xl px-3.5 py-2.5 border border-white/10 focus-within:border-white/30 transition-all shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-bone-400 shrink-0 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery" 
            @input="onSearchInput"
            ref="searchInput"
            type="text" 
            placeholder="Search shows, movies, anime..." 
            class="w-full bg-transparent text-white placeholder-bone-400 focus:outline-none text-sm sm:text-base font-normal font-sans"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="text-bone-400 hover:text-white p-1 cursor-pointer"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cancel button (Screenshot 4) -->
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="text-white text-sm font-semibold hover:text-[#E50914] transition-colors shrink-0 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Category Tabs (Active when searching) -->
    <div v-if="searchQuery" class="max-w-4xl mx-auto mb-6 flex overflow-x-auto no-scrollbar gap-2 pb-1">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="currentTab = tab.value"
        :class="[
          'px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-colors border',
          currentTab === tab.value 
            ? 'bg-white text-black font-bold border-white shadow-md' 
            : 'bg-surface-100 text-bone-300 hover:bg-surface-200 hover:text-white border-white/10'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && results.length === 0" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Netflix iOS Recommended Shows & Movies List (Screenshot 4) -->
    <div v-else-if="!searchQuery" class="max-w-4xl mx-auto space-y-3">
      <h2 class="text-base sm:text-lg font-bold text-white font-display tracking-tight text-left mb-2">
        Recommended Shows & Movies
      </h2>

      <div class="space-y-2">
        <div
          v-for="(item, index) in recommendedList"
          :key="item.id"
          @click="navigateToItem(item)"
          class="group flex items-center justify-between bg-surface-100/50 hover:bg-surface-200/90 rounded-xl p-1.5 sm:p-2 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
        >
          <!-- 16:9 Thumbnail (Screenshot 4) -->
          <div class="relative w-32 sm:w-40 aspect-video rounded-lg overflow-hidden bg-surface-200 shrink-0">
            <img
              :src="backdrop(item.backdrop_path, 'w780') || poster(item.poster_path, 'w342')"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <!-- TOP 10 Tag (Screenshot 4) -->
            <div v-if="index < 3" class="absolute top-1 left-1 bg-[#E50914] text-white font-black text-[7px] uppercase px-1 py-0.5 rounded shadow">
              TOP 10
            </div>
            <!-- Bottom Ribbon Tag -->
            <div class="absolute bottom-1 left-1 bg-[#E50914] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
              {{ index % 2 === 0 ? 'Recently added' : 'Leaving Soon' }}
            </div>
          </div>

          <!-- Title -->
          <div class="flex-1 min-w-0 px-3.5 text-left">
            <h3 class="text-sm sm:text-base font-semibold text-white group-hover:text-[#E50914] transition-colors line-clamp-2">
              {{ item.title || item.name }}
            </h3>
            <p class="text-xs text-bone-400 mt-0.5 font-mono">
              {{ item.media_type === 'tv' || item.name ? 'TV Series' : 'Movie' }} &bull; ★ {{ (item.vote_average || 0).toFixed(1) }}
            </p>
          </div>

          <!-- Circular Play Button (Screenshot 4) -->
          <button
            @click.stop="playItem(item)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/70 group-hover:border-white group-hover:bg-white text-white group-hover:text-black flex items-center justify-center shrink-0 transition-all mr-2 shadow-md active:scale-95 cursor-pointer"
            title="Play Now"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Results Found -->
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
import { searchMulti, profile, getTrending, backdrop, poster } from '@/api/tmdb.js'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll.js'

const route = useRoute()
const router = useRouter()

const searchInput = ref(null)
const searchQuery = ref('')
const results = ref([])
const recommendedList = ref([])
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

const navigateToItem = (item) => {
  if (item.media_type === 'tv' || item.name) {
    router.push(`/tv/${item.id}`)
  } else {
    router.push(`/movie/${item.id}`)
  }
}

const playItem = (item) => {
  if (item.media_type === 'tv' || item.name) {
    router.push(`/tv/${item.id}/watch/1/1`)
  } else {
    router.push(`/movie/${item.id}/watch`)
  }
}

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

onMounted(async () => {
  try {
    const trending = await getTrending()
    recommendedList.value = (trending.results || []).slice(0, 15)
  } catch (err) {
    console.error('Failed to load recommended titles', err)
  }

  if (route.query.q) {
    searchQuery.value = String(route.query.q)
    performSearch(false)
  }
  searchInput.value?.focus()
})
</script>
