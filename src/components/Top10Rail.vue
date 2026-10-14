<template>
  <div v-if="items && items.length > 0" class="relative mb-8 md:mb-10">
    <!-- Header with Title & Top-Right Slide Dashes -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2.5">
        <h2 class="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[18px] lg:text-[19px]">
          {{ title }}
        </h2>
      </div>

      <!-- Carousel Pagination Indicator Dashes (Matches Redflix/Netflix) -->
      <div v-if="totalPages > 1" class="hidden md:flex items-center gap-[3px]">
        <span
          v-for="page in totalPages"
          :key="page"
          :class="[
            'h-[2px] w-3 transition-colors duration-200 rounded-full',
            page - 1 === currentPage ? 'bg-white/95' : 'bg-white/30'
          ]"
        />
      </div>
    </div>

    <!-- Scroller Rail Wrapper with Hover Chevrons -->
    <div class="group/row relative" data-row-rail="true">
      <!-- Left Prev Button with Dark Edge Fade -->
      <button
        v-if="canScrollLeft"
        type="button"
        @click="scroll('left')"
        class="absolute left-0 top-0 bottom-0 z-30 hidden md:flex items-center justify-start pl-2 w-14 lg:w-16 bg-gradient-to-r from-black/90 via-black/50 to-transparent text-white opacity-0 group-hover/row:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="See previous titles"
      >
        <svg viewBox="0 0 36 36" width="22" height="22" fill="none" class="rotate-180 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform">
          <path fill="currentColor" fill-rule="evenodd" d="M23.586 18 12.293 29.293l1.414 1.414 12-12a1 1 0 0 0 0-1.414l-12-12-1.414 1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Right Next Button with Dark Edge Fade -->
      <button
        v-if="canScrollRight"
        type="button"
        @click="scroll('right')"
        class="absolute right-0 top-0 bottom-0 z-30 hidden md:flex items-center justify-end pr-2 w-14 lg:w-16 bg-gradient-to-l from-black/90 via-black/50 to-transparent text-white opacity-0 group-hover/row:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="See more titles"
      >
        <svg viewBox="0 0 36 36" width="22" height="22" fill="none" class="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform">
          <path fill="currentColor" fill-rule="evenodd" d="M23.586 18 12.293 29.293l1.414 1.414 12-12a1 1 0 0 0 0-1.414l-12-12-1.414 1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Horizontal Cards Track with Exact Redflix Top10 Structure -->
      <div 
        ref="railRef"
        @scroll="updateScrollState"
        class="flex gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x select-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <div 
          v-for="(item, index) in items.slice(0, 10)" 
          :key="item.id"
          :style="getCardStyle(index + 1)"
          class="top10-card group relative z-0 flex-shrink-0 cursor-pointer transition-transform duration-300 md:hover:z-20 md:hover:scale-[1.03] snap-start"
          @click="goToPlay(item)"
          :aria-label="`#${index + 1} ${item.title || item.name}`"
        >
          <div class="relative flex h-full w-full items-end">
            <!-- Giant Rank Number (Clean crisp silver stroke, highly visible on left) -->
            <div class="top10-card-rank pointer-events-none absolute left-0 top-0 flex items-end justify-center">
              <span class="top10-card-rank-num select-none font-black leading-none font-sans">
                {{ index + 1 }}
              </span>
            </div>

            <!-- Poster Card (Overlaps number on right) -->
            <div class="top10-card-poster relative z-10 ml-auto overflow-hidden rounded-lg bg-surface-100 md:rounded-xl border border-white/10 group-hover:border-[#E50914] shadow-card group-hover:shadow-[0_0_25px_rgba(229,9,20,0.45)] transition-all duration-300">
              <img
                v-if="item.poster_path"
                :src="poster(item.poster_path, 'w342')"
                :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-surface-200 text-bone-400 text-xs text-center p-2">
                {{ item.title || item.name }}
              </div>

              <!-- Recently Added Red Badge (Centered at bottom as in screenshot) -->
              <div 
                v-if="isRecentlyAdded(item)" 
                class="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-t-[3px] bg-[#E50914] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md md:px-2 md:py-1 md:text-[10px] uppercase font-sans tracking-tight"
              >
                Recently added
              </div>

              <!-- Hover Play Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
                <span class="text-xs font-bold text-white line-clamp-1 mb-1 font-sans">
                  {{ item.title || item.name }}
                </span>
                <div class="flex items-center justify-between text-[11px] text-bone-300 font-mono">
                  <span class="text-[#E50914] font-bold">★ {{ (item.vote_average || 0).toFixed(1) }}</span>
                  <span class="w-6 h-6 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-md text-[10px]">
                    ▶
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { poster } from '@/api/tmdb.js'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  mediaType: {
    type: String,
    default: 'movie'
  }
})

const router = useRouter()
const railRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const totalPages = ref(2)
const currentPage = ref(0)

// Exact number width metrics from Redflix
const NUMBER_WIDTHS = {
  1: 52,
  2: 83,
  3: 88,
  4: 88,
  5: 87,
  6: 88,
  7: 88,
  8: 88,
  9: 88,
  10: 114
}

const getCardStyle = (rank) => {
  const posterW = 167
  const numW = NUMBER_WIDTHS[rank] || 88
  const totalW = posterW + numW - 22
  const font = rank === 10 ? '122px' : rank === 1 ? '112px' : '116px'

  return {
    '--top10-num-w': `${numW}px`,
    '--top10-poster-w': `${posterW}px`,
    '--top10-total-w': `${totalW}px`,
    '--top10-font': font
  }
}

const isRecentlyAdded = (item) => {
  const dateStr = item.release_date || item.first_air_date
  if (!dateStr) return false
  const diffDays = (Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24)
  return diffDays < 120 && diffDays > -30
}

const updateScrollState = () => {
  const el = railRef.value
  if (!el) return
  const { scrollLeft, scrollWidth, clientWidth } = el
  const maxScroll = scrollWidth - clientWidth
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < maxScroll - 10

  const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth))
  totalPages.value = pages
  currentPage.value = scrollLeft >= maxScroll - 15 ? pages - 1 : Math.round(scrollLeft / clientWidth)
}

const scroll = (direction) => {
  const el = railRef.value
  if (!el) return
  const scrollAmount = el.clientWidth * 0.75
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
  setTimeout(updateScrollState, 350)
}

const goToPlay = (item) => {
  const type = item.media_type || props.mediaType || (item.name ? 'tv' : 'movie')
  if (type === 'tv') {
    router.push({ name: 'TvDetail', params: { id: item.id } })
  } else {
    router.push({ name: 'MovieDetail', params: { id: item.id } })
  }
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('resize', updateScrollState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>

<style scoped>
.top10-card {
  --top10-scale: 0.68;
  width: calc(var(--top10-total-w) * var(--top10-scale));
  min-width: calc(var(--top10-total-w) * var(--top10-scale));
  height: calc(250px * var(--top10-scale));
}

.top10-card-rank {
  width: calc(var(--top10-num-w) * var(--top10-scale));
  height: calc(250px * var(--top10-scale));
}

.top10-card-rank-num {
  font-size: calc(var(--top10-font) * var(--top10-scale));
  line-height: 0.82;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.58);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9));
}

.top10-card-poster {
  width: calc(var(--top10-poster-w) * var(--top10-scale));
  height: calc(250px * var(--top10-scale));
}

@media (min-width: 640px) {
  .top10-card {
    --top10-scale: 0.84;
  }
  .top10-card-rank-num {
    -webkit-text-stroke: 2.5px rgba(255, 255, 255, 0.62);
  }
}

@media (min-width: 768px) {
  .top10-card {
    --top10-scale: 1;
  }
  .top10-card-rank-num {
    -webkit-text-stroke: 2.75px rgba(255, 255, 255, 0.65);
  }
}
</style>
