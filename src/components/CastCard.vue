<template>
  <div class="cast-card flex flex-col items-center text-center cursor-pointer group" @click="navigate">
    <div class="relative w-24 h-24 md:w-32 md:h-32 mb-3 rounded-full overflow-hidden bg-surface-200 border-2 border-transparent group-hover:border-accent transition-colors duration-300">
      <img
        v-if="person.profile_path"
        :src="profile(person.profile_path, 'w185')"
        :alt="person.name"
        class="w-full h-full object-cover"
        @load="imageLoaded = true"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-surface-300 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div v-if="person.profile_path && !imageLoaded" class="absolute inset-0 skeleton"></div>
    </div>
    <h4 class="text-white text-sm md:text-base font-medium line-clamp-1 group-hover:text-accent transition-colors">{{ person.name }}</h4>
    <p class="text-gray-400 text-xs md:text-sm line-clamp-2 mt-1">{{ person.character }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { profile } from '@/api/tmdb.js'

const props = defineProps({
  person: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const imageLoaded = ref(false)

const navigate = () => {
  router.push(`/person/${props.person.id}`)
}
</script>

<style scoped>
.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #2a2a2a;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
