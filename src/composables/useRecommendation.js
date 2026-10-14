import { ref } from 'vue'
import { 
  getMovieRecommendations, 
  getMovieSimilar, 
  getTvRecommendations,
  getTvSimilar,
  getTopRatedMovies, 
  getTopRatedTv, 
  getTrending,
  getTrendingAnime,
  getTopRatedAnime,
  discoverMovies,
  discoverTv
} from '@/api/tmdb.js'
import { useProgress } from '@/composables/useProgress.js'
import { useWatchlist } from '@/composables/useWatchlist.js'

// Global shared state
const isOpen = ref(false)
const isLoading = ref(false)
const step = ref('prompt') // 'prompt' | 'result'
const selectedType = ref('any') // 'any' | 'movie' | 'tv' | 'anime'
const selectedVibe = ref('taste') // 'taste' | 'action' | 'comedy' | 'scifi' | 'horror' | 'romance' | 'top_rated' | 'hidden_gems' | 'quick'
const currentSuggestion = ref(null)
const seenSuggestionIds = new Set()

export function useRecommendation() {
  const { items: progressItems } = useProgress()
  const { items: watchlistItems } = useWatchlist()

  async function getPersonalizedSuggestion(overrideType = null, overrideVibe = null) {
    isLoading.value = true
    step.value = 'result'

    const type = overrideType || selectedType.value
    const vibe = overrideVibe || selectedVibe.value

    try {
      const watched = progressItems.value || []
      const watchlisted = watchlistItems.value || []

      const allKnownIds = new Set([
        ...watched.map(i => String(i.id)),
        ...watchlisted.map(i => String(i.id)),
        ...Array.from(seenSuggestionIds)
      ])

      let candidates = []
      let reason = ''
      let finalMediaType = type === 'any' ? (Math.random() > 0.5 ? 'movie' : 'tv') : type

      // Random page helper
      const randomPage = Math.floor(Math.random() * 4) + 1

      // ============================================
      // 1. ANIME CATEGORY
      // ============================================
      if (type === 'anime') {
        finalMediaType = 'tv'
        const [trending, top] = await Promise.all([
          getTrendingAnime(randomPage).catch(() => ({ results: [] })),
          getTopRatedAnime(randomPage).catch(() => ({ results: [] }))
        ])

        const pool = [
          ...(trending.results || []),
          ...(top.results || [])
        ].filter(m => m && (m.poster_path || m.backdrop_path) && !allKnownIds.has(String(m.id)))

        candidates = pool.length > 0 ? pool : (trending.results || [])
        reason = 'Handpicked Anime masterwork matching your vibe'
      }

      // ============================================
      // 2. SPECIFIC MOOD / VIBE (Action, Sci-Fi, Comedy, Horror, Romance, Top-Rated, Hidden Gems, Quick Watch)
      // ============================================
      else if (vibe === 'action') {
        if (finalMediaType === 'tv') {
          const res = await discoverTv({ with_genres: '10759', 'vote_average.gte': 7.0, sort_by: 'popularity.desc', page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        } else {
          finalMediaType = 'movie'
          const res = await discoverMovies({ with_genres: '28', 'vote_average.gte': 6.8, 'vote_count.gte': 150, sort_by: 'popularity.desc', page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        }
        reason = 'High-octane Action & Thrills pick'
      } 
      else if (vibe === 'scifi') {
        if (finalMediaType === 'tv') {
          const res = await discoverTv({ with_genres: '10765', 'vote_average.gte': 7.0, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        } else {
          finalMediaType = 'movie'
          const res = await discoverMovies({ with_genres: '878', 'vote_average.gte': 6.8, 'vote_count.gte': 150, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        }
        reason = 'Mind-bending Sci-Fi & Speculative universe'
      }
      else if (vibe === 'comedy') {
        finalMediaType = type === 'tv' ? 'tv' : 'movie'
        if (finalMediaType === 'tv') {
          const res = await discoverTv({ with_genres: '35', 'vote_average.gte': 7.0, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        } else {
          const res = await discoverMovies({ with_genres: '35', 'vote_average.gte': 6.5, 'vote_count.gte': 100, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        }
        reason = 'Laugh-out-loud Comedy & Feel-Good recommendation'
      }
      else if (vibe === 'horror') {
        finalMediaType = 'movie'
        const res = await discoverMovies({ with_genres: '27,53', 'vote_average.gte': 6.2, 'vote_count.gte': 150, page: randomPage }).catch(() => ({ results: [] }))
        candidates = res.results || []
        reason = 'Dark, Suspenseful & Spine-Chilling horror thriller'
      }
      else if (vibe === 'romance') {
        finalMediaType = type === 'tv' ? 'tv' : 'movie'
        if (finalMediaType === 'tv') {
          const res = await discoverTv({ with_genres: '18', 'vote_average.gte': 7.2, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        } else {
          const res = await discoverMovies({ with_genres: '10749,18', 'vote_average.gte': 7.0, page: randomPage }).catch(() => ({ results: [] }))
          candidates = res.results || []
        }
        reason = 'Compelling Romance & Heartfelt drama'
      }
      else if (vibe === 'top_rated') {
        finalMediaType = type === 'tv' ? 'tv' : 'movie'
        const res = finalMediaType === 'tv'
          ? await getTopRatedTv(randomPage).catch(() => ({ results: [] }))
          : await getTopRatedMovies(randomPage).catch(() => ({ results: [] }))
        candidates = (res.results || []).filter(m => (m.vote_average || 0) >= 7.8)
        reason = 'Masterpiece with 8.0+ Critical Acclaim'
      }
      else if (vibe === 'hidden_gems') {
        finalMediaType = 'movie'
        const res = await discoverMovies({
          'vote_average.gte': 7.5,
          'vote_count.lte': 1800,
          'vote_count.gte': 80,
          sort_by: 'vote_average.desc',
          page: randomPage
        }).catch(() => ({ results: [] }))
        candidates = res.results || []
        reason = 'Underrated Hidden Gem that flew under the radar'
      }
      else if (vibe === 'quick') {
        finalMediaType = 'movie'
        const res = await discoverMovies({
          'with_runtime.lte': 95,
          'vote_average.gte': 6.6,
          sort_by: 'popularity.desc',
          page: randomPage
        }).catch(() => ({ results: [] }))
        candidates = res.results || []
        reason = 'Fast-paced Quick Watch under 90 minutes'
      }

      // ============================================
      // 3. TASTE-BASED PERSONALIZED RECOMMENDATIONS (Default)
      // ============================================
      if (candidates.length === 0 && vibe === 'taste') {
        const poolItems = [...watched, ...watchlisted]
        const relevantHistory = poolItems.filter(i => {
          const itemType = i.media_type || (i.title ? 'movie' : 'tv')
          return type === 'any' || itemType === type
        })

        if (relevantHistory.length > 0) {
          const shuffledSources = [...relevantHistory].sort(() => 0.5 - Math.random())

          for (const source of shuffledSources.slice(0, 3)) {
            const isMovie = (source.media_type || (source.title ? 'movie' : 'tv')) === 'movie'
            finalMediaType = isMovie ? 'movie' : 'tv'

            try {
              const recRes = isMovie
                ? await getMovieRecommendations(source.id).catch(() => null)
                : await getTvRecommendations(source.id).catch(() => null)
              
              const filtered = recRes?.results?.filter(m => m && (m.poster_path || m.backdrop_path) && !allKnownIds.has(String(m.id))) || []

              if (filtered.length > 0) {
                candidates = filtered
                const sourceTitle = source.title || source.name
                reason = `Because you enjoyed "${sourceTitle}"`
                break
              }

              // Fallback to similar
              const simRes = isMovie
                ? await getMovieSimilar(source.id).catch(() => null)
                : await getTvSimilar(source.id).catch(() => null)
              
              const simFiltered = simRes?.results?.filter(m => m && (m.poster_path || m.backdrop_path) && !allKnownIds.has(String(m.id))) || []
              if (simFiltered.length > 0) {
                candidates = simFiltered
                const sourceTitle = source.title || source.name
                reason = `Similar vibe to "${sourceTitle}" from your taste`
                break
              }
            } catch (e) {
              console.warn('Taste recommendation query failed:', e)
            }
          }
        }
      }

      // ============================================
      // 4. FALLBACK POOL
      // ============================================
      if (candidates.length === 0) {
        if (finalMediaType === 'tv') {
          const res = await getTopRatedTv(randomPage).catch(() => ({ results: [] }))
          candidates = res.results || []
          reason = 'Top-rated binge-worthy TV series'
        } else {
          finalMediaType = 'movie'
          const res = await getTrending(1).catch(() => ({ results: [] }))
          candidates = (res.results || []).filter(t => t.media_type === 'movie' || !t.name)
          reason = 'Trending must-watch title'
        }
      }

      // Filter out seen IDs and pick randomly
      const validPool = candidates.filter(m => m && (m.poster_path || m.backdrop_path) && !allKnownIds.has(String(m.id)))
      const finalPool = validPool.length > 0 ? validPool : candidates

      if (finalPool.length > 0) {
        const picked = finalPool[Math.floor(Math.random() * finalPool.length)]
        seenSuggestionIds.add(String(picked.id))

        const resolvedMediaType = picked.media_type || finalMediaType || (picked.title ? 'movie' : 'tv')

        currentSuggestion.value = {
          ...picked,
          media_type: resolvedMediaType,
          reason: reason || 'Curated pick for you'
        }
      }
    } catch (err) {
      console.error('Error generating surprise recommendation:', err)
    } finally {
      isLoading.value = false
    }
  }

  function openSuggestion() {
    isOpen.value = true
    step.value = 'prompt' // Always ask first!
  }

  function submitPrompt(type, vibe) {
    if (type) selectedType.value = type
    if (vibe) selectedVibe.value = vibe
    getPersonalizedSuggestion(selectedType.value, selectedVibe.value)
  }

  function backToPrompt() {
    step.value = 'prompt'
  }

  function rollAgain() {
    getPersonalizedSuggestion()
  }

  function closeSuggestion() {
    isOpen.value = false
    step.value = 'prompt'
  }

  return {
    isOpen,
    isLoading,
    step,
    selectedType,
    selectedVibe,
    currentSuggestion,
    openSuggestion,
    submitPrompt,
    backToPrompt,
    rollAgain,
    closeSuggestion
  }
}
