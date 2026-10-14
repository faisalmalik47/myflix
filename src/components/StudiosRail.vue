<template>
  <section id="watch-by-platform" class="relative mb-7 md:mb-8 scroll-mt-[4.5rem]" aria-labelledby="platforms-row-heading">
    <!-- Row Header -->
    <div class="mb-2 px-0 md:mb-2.5 flex items-center justify-between">
      <h2 id="platforms-row-heading" class="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[18px] lg:text-[19px]">
        Studios & Platforms
      </h2>
      <span class="text-xs text-bone-400 font-medium hidden sm:inline-block">Curated Networks</span>
    </div>

    <!-- Scroller Rail -->
    <div class="group/row relative" data-row-rail="true">
      <!-- Left Chevron Button -->
      <button
        v-if="canScrollLeft"
        type="button"
        @click="scroll(-1)"
        class="absolute left-0 top-1/2 z-20 hidden md:flex -translate-y-1/2 items-center justify-center w-10 h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover/row:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="Scroll Studios and Platforms left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <!-- Right Chevron Button -->
      <button
        v-if="canScrollRight"
        type="button"
        @click="scroll(1)"
        class="absolute right-0 top-1/2 z-20 hidden md:flex -translate-y-1/2 items-center justify-center w-10 h-full bg-gradient-to-l from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover/row:opacity-100 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label="Scroll Studios and Platforms right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <!-- Cards Track -->
      <div
        ref="scrollerRef"
        @scroll="checkScroll"
        class="scrollbar-hide flex min-w-0 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x touch-pan-y md:gap-3.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] pt-1 pb-3 md:pt-2 md:pb-4"
      >
        <router-link
          v-for="platform in platforms"
          :key="platform.provider_id"
          :to="`/platforms/${platform.provider_id}/movie`"
          class="group relative isolate block aspect-video w-[calc((100vw-2rem-0.75rem)/2.15)] max-w-[168px] shrink-0 overflow-hidden rounded-xl text-white transition-all duration-300 ease-out min-[480px]:w-[calc((100vw-2rem-0.75rem)/2.65)] min-[480px]:max-w-[180px] md:w-[calc((100vw-4rem-1rem)/3.35)] md:max-w-[210px] lg:w-[calc((100vw-8rem-1rem)/4.35)] lg:max-w-[232px] xl:w-[calc((100vw-8rem-1.25rem)/5.35)] xl:max-w-[248px] hover:scale-[1.03] active:scale-95 shadow-md hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
          :style="{ background: `linear-gradient(145deg, ${platform.accent} 0%, color-mix(in srgb, ${platform.accent} 58%, #050505) 100%)` }"
          :aria-label="`Browse ${platform.provider_name}`"
        >
          <!-- Radial gloss highlight -->
          <span
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_-10%,rgba(255,255,255,0.18),transparent_55%)]"
            aria-hidden="true"
          />

          <!-- Platform Logo -->
          <img
            :src="platform.local_logo_path"
            :alt="platform.provider_name"
            width="220"
            height="110"
            loading="lazy"
            :class="[
              'absolute left-1/2 top-1/2 max-h-[52%] max-w-[78%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition-transform duration-[450ms] group-hover:scale-[1.06]',
              platform.invertLogo ? 'brightness-0 invert' : ''
            ]"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CURATED_STREAMING_PLATFORMS } from '@/api/tmdb.js'

const platforms = CURATED_STREAMING_PLATFORMS
const scrollerRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const checkScroll = () => {
  const el = scrollerRef.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  canScrollLeft.value = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft < maxScroll - 10
}

const scroll = (direction) => {
  const el = scrollerRef.value
  if (!el) return
  const firstCard = el.querySelector('a')
  const gap = 14
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : el.clientWidth * 0.7
  el.scrollBy({
    left: direction * cardWidth * 2.5,
    behavior: 'smooth'
  })
}

onMounted(() => {
  checkScroll()
  window.addEventListener('resize', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>
