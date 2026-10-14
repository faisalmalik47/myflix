import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(callback, options = {}) {
  const sentinel = ref(null)
  const loading = ref(false)
  let observer = null

  onMounted(() => {
    if (!sentinel.value) return
    observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading.value) {
          loading.value = true
          await callback()
          loading.value = false
        }
      },
      { rootMargin: '200px', ...options }
    )
    observer.observe(sentinel.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { sentinel, loading }
}
