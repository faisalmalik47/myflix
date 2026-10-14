<template>
  <div class="min-h-screen bg-[#0a0a0c] text-white pb-20 md:pb-8 pt-4">
    <!-- Top Bar Header (Desktop & Mobile) -->
    <div class="relative overflow-hidden border-b border-white/[0.08] mb-6">
      <!-- Ambient background subtle radial glow -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-25%,rgba(229,9,20,0.15),transparent_58%)]" aria-hidden="true"></div>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0c]" aria-hidden="true"></div>

      <div class="relative px-4 md:px-8 pt-4 pb-6 lg:pb-8 max-w-[1920px] mx-auto">
        <div class="flex flex-row gap-6 lg:gap-8 items-start lg:items-center">
          <!-- Square / Rounded Logo Card -->
          <div class="relative h-[92px] w-[92px] lg:h-[116px] lg:w-[116px] shrink-0 rounded-2xl bg-gradient-to-br from-white/[0.14] to-white/[0.03] p-3 lg:p-4 shadow-[0_12px_48px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.12] flex items-center justify-center">
            <img
              :src="currentPlatform.local_logo_path"
              :alt="`${currentPlatform.provider_name} logo`"
              class="object-contain h-full w-full max-h-full max-w-full drop-shadow-md"
              :class="currentPlatform.invertLogo ? 'brightness-0 invert' : ''"
            />
          </div>

          <!-- Titles with Red Accent Vertical Line -->
          <div class="min-w-0 flex-1 text-left border-l-2 border-[#E50914]/40 pl-5 lg:pl-6">
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-bone-400 mb-1.5 lg:text-[11px]">
              {{ activeType === 'tv' ? 'SHOWS CATALOG' : 'MOVIE CATALOG' }}
            </p>
            <h1 class="max-w-3xl text-3xl font-bold tracking-tight text-white lg:text-[2.125rem] lg:leading-[1.15] xl:text-4xl xl:leading-tight">
              {{ currentPlatform.provider_name }} — {{ activeType === 'tv' ? 'Shows' : 'Movies' }}
            </h1>
            <p class="mt-2.5 max-w-xl text-sm leading-relaxed text-bone-400 lg:text-[0.9375rem]">
              {{ activeType === 'tv' ? 'Shows' : 'Movies' }} on MyFlix that list this provider in the catalog.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 md:px-8 max-w-[1920px] mx-auto space-y-5">
      <!-- Unified Filter Bar (Matches Redflix Pill Bar) -->
      <div class="sticky top-16 z-30 -mx-4 md:mx-0 border-b border-white/[0.08] bg-[#0a0a0c]/95 px-4 py-2.5 backdrop-blur-xl md:rounded-2xl md:border md:border-white/10 md:bg-[#111114]/95 md:px-4 md:py-3 md:shadow-2xl">
        <div class="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-4">
          <!-- Left Controls (Movies/TV toggle, Platform dropdown, Sort, Age) -->
          <div class="flex items-center justify-between gap-2 md:justify-start md:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <!-- Movies / TV Shows Toggle Pill -->
            <div class="flex rounded-lg md:rounded-xl bg-black/40 p-0.5 md:p-1 ring-1 ring-white/[0.08] shrink-0">
              <button
                @click="switchType('movie')"
                :class="[
                  'rounded-md md:rounded-lg px-3.5 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer',
                  activeType === 'movie' ? 'bg-white text-black shadow-md' : 'text-bone-400 hover:text-white'
                ]"
              >
                Movies
              </button>
              <button
                @click="switchType('tv')"
                :class="[
                  'rounded-md md:rounded-lg px-3.5 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer',
                  activeType === 'tv' ? 'bg-white text-black shadow-md' : 'text-bone-400 hover:text-white'
                ]"
              >
                TV Shows
              </button>
            </div>

            <!-- Platform Dropdown Select -->
            <select
              :value="providerId"
              @change="onPlatformSelect($event.target.value)"
              class="h-9 md:h-10 shrink-0 cursor-pointer rounded-lg md:rounded-xl border border-white/10 bg-surface-200 px-3 text-xs md:text-sm font-medium text-white outline-none hover:border-white/20 focus:border-[#E50914]"
            >
              <option v-for="p in platforms" :key="p.provider_id" :value="p.provider_id">
                {{ p.provider_name }}
              </option>
            </select>

            <!-- Sort By Dropdown -->
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[11px] font-mono text-bone-400 uppercase font-semibold hidden lg:inline">Sort</span>
              <select
                v-model="selectedSort"
                @change="onFilterChange"
                class="h-9 md:h-10 shrink-0 cursor-pointer rounded-lg md:rounded-xl border border-white/10 bg-surface-200 px-3 text-xs md:text-sm font-medium text-white outline-none hover:border-white/20 focus:border-[#E50914]"
              >
                <option value="popularity.desc">Most popular</option>
                <option value="vote_average.desc">Top rated</option>
                <option value="primary_release_date.desc">Newest</option>
                <option value="title.asc">Title A-Z</option>
              </select>
            </div>

            <!-- All / Maturity Dropdown -->
            <select
              v-model="selectedMaturity"
              @change="onFilterChange"
              class="h-9 md:h-10 shrink-0 cursor-pointer rounded-lg md:rounded-xl border border-white/10 bg-surface-200 px-3 text-xs md:text-sm font-medium text-white outline-none hover:border-white/20 focus:border-[#E50914]"
            >
              <option value="all">All</option>
              <option value="safe">PG / Family</option>
              <option value="mature">TV-MA / R</option>
            </select>
          </div>

          <!-- Search on Platform Input -->
          <div class="relative w-full md:min-w-0 md:flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400 md:left-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              type="search"
              :placeholder="`Search on ${currentPlatform.provider_name}…`"
              class="w-full bg-surface-200 text-white border border-white/10 rounded-full py-2 pl-10 pr-10 text-xs md:text-sm font-medium placeholder:text-bone-400 focus:outline-none focus:border-[#E50914] md:py-2.5 md:pl-12"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-bone-400 hover:text-white cursor-pointer text-lg leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Genre Pills Row (Exact Redflix Style) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-bone-400 font-mono">
            GENRE
          </span>
        </div>

        <div class="relative group/genres flex items-center">
          <div
            ref="genresScroller"
            class="scrollbar-hide flex items-center gap-2 overflow-x-auto overflow-y-hidden py-1 touch-pan-x w-full"
          >
            <button
              v-for="genre in GENRES"
              :key="genre.name"
              @click="selectGenre(genre.id)"
              :class="[
                'px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer border',
                selectedGenreId === genre.id
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                  : 'bg-surface-100 hover:bg-surface-200 text-bone-300 hover:text-white border-white/8 hover:border-white/20'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>

          <!-- Scroll Genre Right Chevron -->
          <button
            @click="scrollGenres(1)"
            class="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-surface-200/90 border border-white/10 hover:bg-surface-300 text-white ml-2 shrink-0 cursor-pointer shadow-lg"
            aria-label="Scroll genres"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="loading && items.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 animate-pulse pt-2">
        <div v-for="i in 18" :key="i" class="aspect-[2/3] bg-surface-200 rounded-xl"></div>
      </div>

      <!-- Clean Poster Cards Grid (Exact Redflix Edge-to-Edge Style) -->
      <div v-else-if="filteredItems.length > 0" class="space-y-8 pt-2">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            @click="navigateToItem(item)"
            class="group relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-200 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] border border-white/5 hover:border-white/20"
          >
            <!-- Poster Image -->
            <img
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w342${item.poster_path}`"
              :alt="item.title || item.name"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div v-else class="h-full w-full flex items-center justify-center bg-surface-300 text-bone-400 text-xs text-center p-2">
              {{ item.title || item.name }}
            </div>

            <!-- Subtle hover overlay with Play action -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <h3 class="text-xs md:text-sm font-bold text-white line-clamp-1">
                {{ item.title || item.name }}
              </h3>
              <div class="flex items-center justify-between mt-1 text-[11px] text-bone-300">
                <span class="text-[#E50914] font-bold">★ {{ (item.vote_average || 0).toFixed(1) }}</span>
                <span>{{ (item.release_date || item.first_air_date || '').substring(0, 4) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !searchQuery" class="flex justify-center pt-4">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="px-8 py-3 bg-surface-200 hover:bg-surface-300 text-white font-bold text-xs md:text-sm rounded-full transition-all border border-white/10 hover:border-white/20 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {{ loadingMore ? 'Loading titles...' : 'Load More Titles' }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24 bg-surface-100/50 rounded-2xl border border-white/5 my-6">
        <p class="text-bone-400 text-sm">
          No titles found matching your search and filter criteria.
        </p>
        <button
          @click="resetFilters"
          class="mt-4 px-5 py-2 bg-surface-200 hover:bg-surface-300 text-white text-xs font-bold rounded-full transition-all border border-white/10 cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CURATED_STREAMING_PLATFORMS, getPlatformTitles } from '@/api/tmdb.js'

const route = useRoute()
const router = useRouter()

const platforms = CURATED_STREAMING_PLATFORMS
const providerId = computed(() => parseInt(route.params.id) || 8)
const activeType = ref(route.params.type === 'tv' ? 'tv' : 'movie')

const currentPlatform = computed(() => {
  return platforms.find(p => p.provider_id === providerId.value) || platforms[0]
})

const selectedSort = ref('popularity.desc')
const selectedMaturity = ref('all')
const selectedGenreId = ref(null)
const searchQuery = ref('')
const genresScroller = ref(null)

const GENRES = [
  { id: null, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
]

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

const filteredItems = computed(() => {
  let list = items.value

  // Genre filter
  if (selectedGenreId.value) {
    list = list.filter(item => (item.genre_ids || []).includes(selectedGenreId.value))
  }

  // Maturity filter
  if (selectedMaturity.value === 'safe') {
    list = list.filter(item => !item.adult)
  }

  // Local search filter
  if (searchQuery.value.trim().length > 0) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item => {
      const title = (item.title || item.name || '').toLowerCase()
      const overview = (item.overview || '').toLowerCase()
      return title.includes(q) || overview.includes(q)
    })
  }

  // Sorting
  if (selectedSort.value === 'vote_average.desc') {
    list = [...list].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
  } else if (selectedSort.value === 'primary_release_date.desc') {
    list = [...list].sort((a, b) => {
      const dateA = a.release_date || a.first_air_date || ''
      const dateB = b.release_date || b.first_air_date || ''
      return dateB.localeCompare(dateA)
    })
  } else if (selectedSort.value === 'title.asc') {
    list = [...list].sort((a, b) => {
      const titleA = a.title || a.name || ''
      const titleB = b.title || b.name || ''
      return titleA.localeCompare(titleB)
    })
  }

  return list
})

const switchType = (type) => {
  if (activeType.value === type) return
  activeType.value = type
  router.replace(`/platforms/${providerId.value}/${type}`)
}

const onPlatformSelect = (id) => {
  router.push(`/platforms/${id}/${activeType.value}`)
}

const selectGenre = (genreId) => {
  selectedGenreId.value = genreId
}

const scrollGenres = (direction) => {
  if (genresScroller.value) {
    genresScroller.value.scrollBy({ left: direction * 250, behavior: 'smooth' })
  }
}

const onSearchInput = () => {
  // Handled reactively by filteredItems
}

const clearSearch = () => {
  searchQuery.value = ''
}

const onFilterChange = () => {
  // Handled reactively
}

const resetFilters = () => {
  selectedGenreId.value = null
  searchQuery.value = ''
  selectedSort.value = 'popularity.desc'
  selectedMaturity.value = 'all'
}

const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  page.value++
  fetchTitles(false)
}

const navigateToItem = (item) => {
  if (activeType.value === 'tv') {
    router.push({ name: 'StreamTv', params: { id: item.id, season: 1, episode: 1 } })
  } else {
    router.push({ name: 'StreamMovie', params: { id: item.id } })
  }
}

watch([() => route.params.id, () => route.params.type], () => {
  activeType.value = route.params.type === 'tv' ? 'tv' : 'movie'
  selectedGenreId.value = null
  searchQuery.value = ''
  fetchTitles(true)
})

onMounted(() => {
  fetchTitles(true)
})
</script>
