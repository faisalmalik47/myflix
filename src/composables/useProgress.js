import { ref } from 'vue'

const STORAGE_KEY = 'cineby_progress'

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

export function useProgress() {
  function getProgressItems() {
    return items.value
  }

  function saveProgress(entry) {
    if (!entry || !entry.id) return
    const idx = items.value.findIndex(i => i.id === entry.id && i.media_type === entry.media_type)
    const record = {
      ...entry,
      updated_at: Date.now(),
    }
    if (idx >= 0) {
      items.value.splice(idx, 1)
    }
    items.value.unshift(record)
    if (items.value.length > 20) {
      items.value = items.value.slice(0, 20)
    }
    save()
  }

  function removeProgress(id) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function getProgress(id) {
    return items.value.find(i => i.id === id)
  }

  return {
    items,
    getProgressItems,
    saveProgress,
    removeProgress,
    getProgress
  }
}
