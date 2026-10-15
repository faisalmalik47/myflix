import { ref } from 'vue'
import { supabase } from '@/config/supabase.js'

const STORAGE_KEY = 'myflix_watchlist'
const LEGACY_STORAGE_KEY = 'cineby_watchlist'

function loadFromStorage() {
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

const items = ref(loadFromStorage())
const isSyncing = ref(false)
let currentUserId = null
let realtimeChannel = null

function saveToStorage() {
  try {
    const serialized = JSON.stringify(items.value)
    localStorage.setItem(STORAGE_KEY, serialized)
    localStorage.setItem(LEGACY_STORAGE_KEY, serialized)
  } catch (e) {
    console.error('Failed to save watchlist to localStorage:', e)
  }
}

// Cross-tab synchronization within the same browser
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
      items.value = loadFromStorage()
    }
  })
}

function formatForDb(item, userId, explicitMediaType) {
  const type = explicitMediaType || item.media_type || (item.title ? 'movie' : 'tv') || 'movie'
  const rawDate = item.release_date || item.first_air_date
  const releaseDate = (rawDate && typeof rawDate === 'string' && rawDate.trim())
    ? rawDate.trim()
    : new Date().toISOString().split('T')[0]

  return {
    user_id: userId,
    id: Number(item.id),
    type: String(type),
    adult: Boolean(item.adult ?? false),
    title: String(item.title || item.name || 'Untitled'),
    poster_path: item.poster_path ? String(item.poster_path) : '',
    backdrop_path: item.backdrop_path ? String(item.backdrop_path) : '',
    release_date: releaseDate,
    vote_average: Number(item.vote_average || 0)
  }
}

function formatFromDb(row) {
  return {
    id: Number(row.id),
    title: row.title || 'Untitled',
    name: row.title || 'Untitled',
    poster_path: row.poster_path || '',
    backdrop_path: row.backdrop_path || '',
    media_type: row.type || 'movie',
    type: row.type || 'movie',
    adult: Boolean(row.adult),
    vote_average: Number(row.vote_average || 0),
    release_date: row.release_date || '',
    first_air_date: row.release_date || '',
    overview: row.overview || '',
    added_at: row.created_at ? new Date(row.created_at).getTime() : Date.now()
  }
}

// Fetch remote watchlist from Supabase and merge with any existing local items
async function fetchAndMergeWatchlist(userId) {
  if (!userId) return
  isSyncing.value = true
  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Failed to fetch remote watchlist from Supabase:', error)
      return
    }

    const remoteItems = (data || []).map(formatFromDb)
    const remoteIdSet = new Set(remoteItems.map(i => String(i.id)))

    // Check if there are local guest items not yet in remote DB
    const localItems = items.value || []
    const missingInDb = localItems.filter(local => !remoteIdSet.has(String(local.id)))

    if (missingInDb.length > 0) {
      const payloads = missingInDb.map(item => formatForDb(item, userId))
      const { error: upsertErr } = await supabase
        .from('watchlist')
        .upsert(payloads)

      if (!upsertErr) {
        missingInDb.forEach(item => {
          remoteItems.unshift(item)
        })
      }
    }

    items.value = remoteItems
    saveToStorage()
  } catch (err) {
    console.error('Error syncing watchlist with Supabase:', err)
  } finally {
    isSyncing.value = false
  }
}

// Setup realtime listener for cross-device updates (phone <-> laptop)
function setupRealtimeListener(userId) {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
    realtimeChannel = null
  }
  if (!userId) return

  realtimeChannel = supabase.channel(`realtime-watchlist-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'watchlist'
      },
      (payload) => {
        const record = payload.new || payload.old
        if (!record || record.user_id !== userId) return

        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const item = formatFromDb(payload.new)
          const index = items.value.findIndex(i => String(i.id) === String(item.id))
          if (index >= 0) {
            items.value[index] = item
          } else {
            items.value.unshift(item)
          }
          saveToStorage()
        } else if (payload.eventType === 'DELETE') {
          const id = record.id
          items.value = items.value.filter(i => String(i.id) !== String(id))
          saveToStorage()
        }
      }
    )
    .subscribe()
}

// Listen to Supabase auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const newUserId = session?.user?.id ?? null
  if (newUserId !== currentUserId) {
    currentUserId = newUserId
    if (newUserId) {
      await fetchAndMergeWatchlist(newUserId)
      setupRealtimeListener(newUserId)
    } else {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
        realtimeChannel = null
      }
    }
  }
})

// Initial session check on module load
supabase.auth.getSession().then(async ({ data }) => {
  const userId = data?.session?.user?.id
  if (userId) {
    currentUserId = userId
    await fetchAndMergeWatchlist(userId)
    setupRealtimeListener(userId)
  }
})

export function useWatchlist() {
  function getWatchlist() {
    return items.value
  }

  function isInWatchlist(target) {
    if (!target && target !== 0) return false
    const id = typeof target === 'object' ? target.id : target
    return items.value.some(i => String(i.id) === String(id))
  }

  async function add(item, explicitMediaType) {
    if (!item) return
    const id = item.id
    if (!isInWatchlist(id)) {
      const type = explicitMediaType || item.media_type || (item.title ? 'movie' : 'tv') || 'movie'
      const newItem = {
        id: item.id,
        title: item.title || item.name || 'Untitled',
        name: item.name || item.title || 'Untitled',
        poster_path: item.poster_path || '',
        backdrop_path: item.backdrop_path || '',
        media_type: type,
        type: type,
        adult: Boolean(item.adult ?? false),
        vote_average: Number(item.vote_average || 0),
        release_date: item.release_date || item.first_air_date || '',
        first_air_date: item.first_air_date || item.release_date || '',
        overview: item.overview || '',
        added_at: Date.now()
      }

      items.value = [newItem, ...items.value]
      saveToStorage()

      // If user is authenticated, sync to Supabase
      if (currentUserId) {
        try {
          const payload = formatForDb(newItem, currentUserId, type)
          const { error } = await supabase.from('watchlist').upsert(payload)
          if (error) {
            console.error('Supabase watchlist upsert error:', error)
          }
        } catch (e) {
          console.error('Failed to sync added item to Supabase:', e)
        }
      }
    }
  }

  async function removeFromWatchlist(id) {
    if (!id && id !== 0) return
    items.value = items.value.filter(i => String(i.id) !== String(id))
    saveToStorage()

    // If user is authenticated, sync delete to Supabase
    if (currentUserId) {
      try {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('id', Number(id))
          .eq('user_id', currentUserId)

        if (error) {
          console.error('Supabase watchlist delete error:', error)
        }
      } catch (e) {
        console.error('Failed to delete item from Supabase:', e)
      }
    }
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

  async function syncWatchlist() {
    if (currentUserId) {
      await fetchAndMergeWatchlist(currentUserId)
    }
  }

  return {
    items,
    isSyncing,
    getWatchlist,
    add,
    remove,
    removeFromWatchlist,
    toggle,
    toggleWatchlist,
    isInWatchlist,
    syncWatchlist
  }
}
