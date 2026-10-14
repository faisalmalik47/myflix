<template>
  <div class="content-rail my-8 md:my-10">
    <div class="flex items-center justify-between mb-3 px-0">
      <h2 class="text-[17px] font-bold leading-tight tracking-[-0.02em] text-white md:text-[18px] lg:text-[19px] flex items-center gap-2">
        <span class="w-1.5 h-4 rounded-full bg-[#E50914] inline-block"></span>
        {{ title }}
      </h2>

      <!-- See All > Link (Screenshot 2: 'My List  See All >') -->
      <router-link
        v-if="seeAllLink"
        :to="seeAllLink"
        class="text-xs font-semibold text-bone-300 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
      >
        <span>See All</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-bone-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>

      <!-- Navigation Indicators / Counter on desktop when no seeAllLink -->
      <div v-else-if="totalPages > 1" class="hidden md:flex items-center gap-[3px]">
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
    
    <div class="group/rail relative" data-row-rail="true">
      <!-- Left Prev Button with Dark Edge Fade -->
      <button 
        v-if="canScrollLeft"
        type="button"
        @click="scroll('left')" 
        class="absolute left-0 top-0 bottom-0 z-30 hidden md:flex items-center justify-start pl-2 w-14 lg:w-16 bg-gradient-to-r from-black/90 via-black/50 to-transparent text-white opacity-0 group-hover/rail:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="Scroll left"
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
        class="absolute right-0 top-0 bottom-0 z-30 hidden md:flex items-center justify-end pr-2 w-14 lg:w-16 bg-gradient-to-l from-black/90 via-black/50 to-transparent text-white opacity-0 group-hover/rail:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="Scroll right"
      >
        <svg viewBox="0 0 36 36" width="22" height="22" fill="none" class="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform">
          <path fill="currentColor" fill-rule="evenodd" d="M23.586 18 12.293 29.293l1.414 1.414 12-12a1 1 0 0 0 0-1.414l-12-12-1.414 1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Carousel Track Container -->
      <div 
        ref="scrollContainer"
        @scroll="updateScrollState"
        class="flex space-x-3 md:space-x-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <PosterCard
          v-for="item in items"
          :key="`${item.id}-${mediaType || item.media_type || (item.name ? 'tv' : 'movie')}`"
          :item="{ ...item, media_type: mediaType || item.media_type || (item.name ? 'tv' : 'movie') }"
          class="flex-none w-[140px] sm:w-[160px] md:w-[175px] lg:w-[195px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PosterCard from './PosterCard.vue'

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
    default: ''
  },
  seeAllLink: {
    type: String,
    default: ''
  }
})

const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const totalPages = ref(1)
const currentPage = ref(0)

const updateScrollState = () => {
  const el = scrollContainer.value
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
  const el = scrollContainer.value
  if (!el) return
  const scrollAmount = el.clientWidth * 0.75
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
  setTimeout(updateScrollState, 350)
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('resize', updateScrollState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>
