<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6" 
      @click="close"
    >
      <div 
        class="relative w-full max-w-5xl aspect-video mx-auto shadow-2xl rounded-2xl overflow-hidden bg-black border border-white/10" 
        @click.stop
      >
        <!-- Header / Close -->
        <button 
          @click="close" 
          class="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-[#E50914] text-white rounded-full transition-all duration-200 focus:outline-none backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 shadow-lg"
          title="Close (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Video Iframe -->
        <iframe
          v-if="effectiveKey"
          :src="`https://www.youtube.com/embed/${effectiveKey}?autoplay=1&rel=0&modestbranding=1`"
          title="Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-white/80 gap-3 bg-[#0d0d12]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p class="text-base font-medium">No trailer available for this title.</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  videoKey: {
    type: String,
    default: ''
  },
  trailerKey: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const effectiveKey = computed(() => props.trailerKey || props.videoKey)
const isOpen = computed(() => props.show)

const close = () => {
  emit('close')
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close()
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

