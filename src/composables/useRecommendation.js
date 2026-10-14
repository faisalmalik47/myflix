import { ref } from 'vue'
import { getMovieRecommendations, getMovieSimilar, getPopularMovies, getTopRatedMovies, getTrending } from '@/api/tmdb.js'
import { useProgress } from '@/composables/useProgress.js'
import { useWatchlist } from '@/composables/useWatchlist.js'

// Global shared state so opening from navbar, hero, or watchlist triggers the same modal
const isOpen = ref(false)
const isLoading = ref(false)
const currentSuggestion = ref(null)
const seenSuggestionIds = new Set()

export function useRecommendation() {
  const { items: progressItems } = useProgress()
  const { items: watchlistItems } = useWatchlist()

  async function getPersonalizedSuggestion() {
    isLoading.value = true

    try {
      // 1. Gather all user movie candidates from progress and watchlist
      const watchedMovies = (progressItems.value || []).filter(i => (i.media_type || (i.title ? 'movie' : 'tv')) === 'movie')
      const watchlistMovies = (watchlistItems.value || []).filter(i => (i.media_type || (i.title ? 'movie' : 'tv')) === 'movie')
      
      const allKnownIds = new Set([
        ...watchedMovies.map(i => String(i.id)),
        ...watchlistMovies.map(i => String(i.id)),
        ...Array.from(seenSuggestionIds)
      ])

      const userPreferences = [...watchedMovies, ...watchlistMovies]

      let candidates = []
      let reason = ''

      // 2. Try to get recommendations from user's history/watchlist
      if (userPreferences.length > 0) {
        // Shuffle source movies to find fresh angles
        const shuffledSources = [...userPreferences].sort(() => 0.5 - Math.random())

        for (const source of shuffledSources.slice(0, 3)) {
          try {
            const res = await getMovieRecommendations(source.id).catch(() => null)
            const results = res?.results?.filter(m => m && m.poster_path && m.backdrop_path && !allKnownIds.has(String(m.id))) || []

            if (results.length > 0) {
              candidates = results
              const sourceTitle = source.title || source.name
              const isWatched = watchedMovies.some(w => String(w.id) === String(source.id))
              reason = isWatched
                ? `Because you watched "${sourceTitle}"`
                : `Based on your interest in "${sourceTitle}"`
              break
            }

            // Fallback to similar movies if recommendations empty
            const simRes = await getMovieSimilar(source.id).catch(() => null)
            const simResults = simRes?.results?.filter(m => m && m.poster_path && m.backdrop_path && !allKnownIds.has(String(m.id))) || []
            if (simResults.length > 0) {
              candidates = simResults
              const sourceTitle = source.title || source.name
              reason = `Similar vibe to "${sourceTitle}" from your taste`
              break
            }
          } catch (e) {
            console.warn('Error fetching personalized movie recs:', e)
          }
        }
      }

      // 3. Fallback to top-rated or trending if no user history or no candidates found
      if (candidates.length === 0) {
        const randomPage = Math.floor(Math.random() * 3) + 1
        const [topRated, trending] = await Promise.all([
          getTopRatedMovies(randomPage).catch(() => ({ results: [] })),
          getTrending(1).catch(() => ({ results: [] }))
        ])

        const pool = [
          ...(topRated.results || []),
          ...(trending.results || []).filter(t => t.media_type === 'movie' || !t.name)
        ].filter(m => m && m.poster_path && m.backdrop_path && !allKnownIds.has(String(m.id)))

        candidates = pool.length > 0 ? pool : (trending.results || [])
        reason = 'Critically-acclaimed trending movie handpicked for you'
      }

      // 4. Pick a random candidate from the pool
      if (candidates.length > 0) {
        const selected = candidates[Math.floor(Math.random() * candidates.length)]
        seenSuggestionIds.add(String(selected.id))

        currentSuggestion.value = {
          ...selected,
          media_type: 'movie',
          reason
        }
      }
    } catch (error) {
      console.error('Failed to generate movie recommendation:', error)
    } finally {
      isLoading.value = false
    }
  }

  function openSuggestion() {
    isOpen.value = true
    getPersonalizedSuggestion()
  }

  function rollAgain() {
    getPersonalizedSuggestion()
  }

  function closeSuggestion() {
    isOpen.value = false
  }

  return {
    isOpen,
    isLoading,
    currentSuggestion,
    openSuggestion,
    rollAgain,
    closeSuggestion
  }
}
