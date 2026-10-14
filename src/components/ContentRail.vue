<template>
  <div class="content-rail my-10">
    <div class="container mx-auto px-4 md:px-8 flex items-center justify-between mb-4">
      <h2 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <span class="w-1 h-5 rounded-full bg-accent inline-block"></span>
        {{ title }}
      </h2>

      <!-- Navigation Arrows -->
      <div class="hidden md:flex items-center gap-2">
        <button 
          @click="scroll('left')" 
          class="w-8 h-8 rounded-full glass-panel hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="scroll('right')" 
          class="w-8 h-8 rounded-full glass-panel hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="relative group">
      <!-- Carousel Container -->
      <div 
        ref="scrollContainer"
        class="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-8 pb-4 pt-1"
      >
        <PosterCard
          v-for="item in items"
          :key="`${item.id}-${mediaType || item.media_type || (item.name ? 'tv' : 'movie')}`"
          :item="{ ...item, media_type: mediaType || item.media_type || (item.name ? 'tv' : 'movie') }"
          class="flex-none w-[145px] sm:w-[165px] md:w-[185px] lg:w-[205px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
  }
})

const scrollContainer = ref(null)

const scroll = (direction) => {
  if (scrollContainer.value) {
    const scrollAmount = scrollContainer.value.clientWidth * 0.75
    const targetScroll = scrollContainer.value.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    
    scrollContainer.value.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }
}
</script>
