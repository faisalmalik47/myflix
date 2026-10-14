import { ref, computed } from 'vue'

const STORAGE_KEY = 'cineby_watchlist'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const items = ref(load())

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

export function useWatchlist() {
  function getWatchlist() {
    return items.value
  }

  function isInWatchlist(target, explicitMediaType) {
    if (!target) return false
    const id = typeof target === 'object' ? target.id : target
    return items.value.some(i => i.id === id)
  }

  function add(item, explicitMediaType) {
    if (!item) return
    const id = item.id
    if (!isInWatchlist(id)) {
      items.value.push({
        id: item.id,
        title: item.title || item.name,
        name: item.name || item.title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        media_type: explicitMediaType || item.media_type || (item.title ? 'movie' : 'tv'),
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        first_air_date: item.first_air_date || item.release_date,
        added_at: Date.now(),
      })
      save()
    }
  }

  function removeFromWatchlist(id) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function remove(id) {
    removeFromWatchlist(id)
  }

  function toggle(item, explicitMediaType) {
    if (!item) return
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id)
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
