import { ref } from 'vue'

const STORAGE_KEY = 'myflix_watchlist'
const LEGACY_STORAGE_KEY = 'cineby_watchlist'

function load() {
  try {
    const modern = localStorage.getItem(STORAGE_KEY)
    if (modern) return JSON.parse(modern)
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) return JSON.parse(legacy)
    return []
  } catch {
    return []
  }
}

const items = ref(load())

function save() {
  try {
    const serialized = JSON.stringify(items.value)
    localStorage.setItem(STORAGE_KEY, serialized)
    localStorage.setItem(LEGACY_STORAGE_KEY, serialized)
  } catch (e) {
    console.error('Failed to save watchlist to localStorage:', e)
  }
}

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
      items.value = load()
    }
  })
}

export function useWatchlist() {
  function getWatchlist() {
    return items.value
  }

  function isInWatchlist(target) {
    if (!target && target !== 0) return false
    const id = typeof target === 'object' ? target.id : target
    return items.value.some(i => String(i.id) === String(id))
  }

  function add(item, explicitMediaType) {
    if (!item) return
    const id = item.id
    if (!isInWatchlist(id)) {
      const type = explicitMediaType || item.media_type || (item.title ? 'movie' : 'tv')
      items.value = [
        {
          id: item.id,
          title: item.title || item.name || 'Untitled',
          name: item.name || item.title || 'Untitled',
          poster_path: item.poster_path || '',
          backdrop_path: item.backdrop_path || '',
          media_type: type,
          vote_average: item.vote_average || 0,
          release_date: item.release_date || item.first_air_date || '',
          first_air_date: item.first_air_date || item.release_date || '',
          overview: item.overview || '',
          added_at: Date.now(),
        },
        ...items.value
      ]
      save()
    }
  }

  function removeFromWatchlist(id) {
    if (!id && id !== 0) return
    items.value = items.value.filter(i => String(i.id) !== String(id))
    save()
  }

  function remove(id) {
    removeFromWatchlist(id)
  }

  function toggle(item, explicitMediaType) {
    if (!item) return
    const id = typeof item === 'object' ? item.id : item
    if (isInWatchlist(id)) {
      removeFromWatchlist(id)
    } else {
      add(item, explicitMediaType)
    }
  }

  function toggleWatchlist(item, explicitMediaType) {
    toggle(item, explicitMediaType)
  }

  return {
    items,
    getWatchlist,
    add,
    remove,
    removeFromWatchlist,
    toggle,
    toggleWatchlist,
    isInWatchlist
  }
}

