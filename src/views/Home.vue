<template>
  <div class="pb-24 lg:pb-16 min-h-screen">
    <!-- Loading Shimmer Skeleton -->
    <div v-if="loading" class="animate-pulse">
      <div class="w-full h-[65vh] md:h-[80vh] bg-surface-100 mb-8"></div>
      <div class="px-4 md:px-8 space-y-8">
        <div v-for="i in 3" :key="i">
          <div class="h-6 w-48 bg-surface-200 mb-4 rounded"></div>
          <div class="flex gap-4 overflow-hidden">
            <div v-for="j in 5" :key="j" class="w-32 md:w-48 h-48 md:h-72 bg-surface-200 rounded-lg flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="fade-in">
      <!-- 1. Hero Spotlight Banner -->
      <HeroBanner v-if="heroItem" :item="heroItem" />
      
      <!-- 2. Prominent Redflix Search Bar Widget (Desktop only, mobile uses floating bottom dock search) -->
      <div class="hidden md:block max-w-3xl mx-auto -mt-16 md:-mt-20 mb-8 relative z-20 px-4">
        <form @submit.prevent="handleHomeSearch" class="relative group">
          <div class="relative flex items-center bg-[#111114]/95 backdrop-blur-xl border border-white/10 focus-within:border-[#E50914] focus-within:shadow-[0_0_35px_rgba(229,9,20,0.4)] rounded-full p-2 transition-all duration-300 shadow-2xl">
            <div class="pl-4 pr-3 text-[#E50914]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="homeSearchQuery"
              type="text"
              placeholder="Search movies, TV shows, anime..."
              class="bg-transparent text-xs sm:text-sm md:text-base text-white placeholder-bone-400 focus:outline-none w-full py-1 font-sans"
            />
            <button
              type="submit"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#E50914] to-[#FF1E27] hover:brightness-110 active:scale-95 text-white font-bold text-xs md:text-sm rounded-full transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        <!-- Quick Trending Suggestions -->
        <div class="flex items-center justify-center gap-2 mt-3 text-xs text-bone-400 flex-wrap">
          <span class="font-mono text-[11px] text-[#E50914] font-semibold">Trending:</span>
          <button
            v-for="tag in ['Deadpool & Wolverine', 'Dune: Part Two', 'Stranger Things', 'Arcane', 'Demon Slayer', 'FROM']"
            :key="tag"
            @click="quickSearchTag(tag)"
            class="px-2.5 py-0.5 rounded-full bg-surface-100/90 hover:bg-surface-200 text-bone-300 hover:text-white border border-white/8 transition-colors text-[11px] cursor-pointer"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      
      <!-- Content Rails (Styled precisely as Netflix iOS App) -->
      <div class="px-4 md:px-8 space-y-7 md:space-y-10 relative z-10 pb-8">
        <!-- 3. Redflix Studios & Platforms -->
        <StudiosRail />

        <!-- Continue Watching for <User> (Screenshot 1) -->
        <ContentRail 
          v-if="progressItems.length > 0"
          :title="`Continue Watching for ${userDisplayName}`" 
          :items="progressItems" 
          :is-progress="true"
        />

        <!-- Top 10 Movies Today (Ranked with giant numbers) -->
        <Top10Rail 
          v-if="top10Movies.length > 0"
          title="Top 10 Movies Today" 
          :items="top10Movies"
          mediaType="movie"
        />

        <!-- Only on MyFlix (Screenshot 2) -->
        <ContentRail 
          v-if="popularTv.length > 0"
          title="Only on MyFlix" 
          :items="popularTv" 
          mediaType="tv"
        />

        <!-- My List (Screenshot 2: 'My List   See All >') -->
        <ContentRail 
          v-if="watchlistItems.length > 0"
          title="My List" 
          :items="watchlistItems" 
          seeAllLink="/watchlist"
        />

        <!-- Today's Top Picks for You (Screenshot 2 & 3) -->
        <ContentRail 
          v-if="popularMovies.length > 0"
          title="Today's Top Picks for You" 
          :items="popularMovies" 
          mediaType="movie"
        />

        <!-- Japanese Anime Series (Screenshot 3) -->
        <ContentRail 
          v-if="trendingAnime.length > 0"
          title="Japanese Anime Series" 
          :items="trendingAnime" 
          seeAllLink="/anime"
        />
        
        <!-- Top 10 TV Shows Today -->
        <Top10Rail 
          v-if="top10Tv.length > 0"
          title="Top 10 TV Shows Today" 
          :items="top10Tv"
          mediaType="tv"
        />

        <!-- New on MyFlix (Screenshot 3) -->
        <ContentRail 
          v-if="trending.length > 0"
          title="New on MyFlix" 
          :items="trending" 
        />
        
        <!-- Top Rated Hits -->
        <ContentRail 
          v-if="topRatedMovies.length > 0"
          title="Top Rated Masterpieces" 
          :items="topRatedMovies" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeroBanner from '@/components/HeroBanner.vue'
import StudiosRail from '@/components/StudiosRail.vue'
import Top10Rail from '@/components/Top10Rail.vue'
import ContentRail from '@/components/ContentRail.vue'
import { 
  getTrending, 
  getPopularMovies, 
  getTopRatedMovies, 
  getPopularTv, 
  getTopRatedTv,
  getTop10Movies,
  getTop10Tv,
  getTrendingAnime
} from '@/api/tmdb.js'
import { useProgress } from '@/composables/useProgress.js'
import { useAuth } from '@/composables/useAuth.js'
import { useWatchlist } from '@/composables/useWatchlist.js'

const router = useRouter()
const homeSearchQuery = ref('')

const { user, profile } = useAuth()
const { watchlist } = useWatchlist()

const userDisplayName = computed(() => {
  const name = user.value?.user_metadata?.full_name || profile.value?.username || user.value?.email?.split('@')[0]
  if (!name) return 'You'
  return name.charAt(0).toUpperCase() + name.slice(1)
})

const watchlistItems = computed(() => watchlist.value || [])

const handleHomeSearch = () => {
  if (homeSearchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: homeSearchQuery.value.trim() } })
  } else {
    router.push({ name: 'Search' })
  }
}

const quickSearchTag = (tag) => {
  router.push({ name: 'Search', query: { q: tag } })
}

const loading = ref(true)
const heroItem = ref(null)
const top10Movies = ref([])
const top10Tv = ref([])
const trendingAnime = ref([])
const trending = ref([])
const popularMovies = ref([])
const topRatedMovies = ref([])
const popularTv = ref([])
const topRatedTv = ref([])

const { getProgressItems } = useProgress()
const progressItems = computed(() => getProgressItems())

onMounted(async () => {
  try {
    const [
      trendingData,
      top10M,
      top10T,
      animeData,
      popMoviesData,
      topMoviesData,
      popTvData,
    ] = await Promise.all([
      getTrending(),
      getTop10Movies().catch(() => []),
      getTop10Tv().catch(() => []),
      getTrendingAnime().catch(() => ({ results: [] })),
      getPopularMovies(),
      getTopRatedMovies(),
      getPopularTv(),
    ])
    
    trending.value = trendingData.results || []
    top10Movies.value = top10M || []
    top10Tv.value = top10T || []
    trendingAnime.value = (animeData.results || []).map(item => ({ ...item, media_type: 'tv' }))
    popularMovies.value = popMoviesData.results || []
    topRatedMovies.value = topMoviesData.results || []
    popularTv.value = popTvData.results || []
    
    if (trending.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(8, trending.value.length))
      heroItem.value = trending.value[randomIndex]
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
  } finally {
    loading.value = false
  }
})
</script>
