<template>
  <div class="person-detail pt-24 pb-20 container mx-auto px-4">
    <div v-if="loading" class="animate-pulse">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-48 md:w-64 h-72 md:h-96 bg-surface-200 rounded-lg mx-auto md:mx-0"></div>
        <div class="flex-1 space-y-4">
          <div class="h-10 bg-surface-200 rounded w-1/2"></div>
          <div class="h-6 bg-surface-200 rounded w-1/4"></div>
          <div class="h-32 bg-surface-200 rounded w-full mt-8"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="person" class="content">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="flex-shrink-0 w-48 md:w-72 mx-auto md:mx-0">
          <img 
            v-if="person.profile_path"
            :src="profile(person.profile_path, 'h632')" 
            :alt="person.name"
            class="w-full rounded-xl shadow-lg object-cover"
          />
          <div v-else class="w-full aspect-[2/3] bg-surface-200 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          
          <div class="mt-6 space-y-4 text-sm text-gray-300 hidden md:block">
            <h3 class="text-white font-semibold text-lg mb-2">Personal Info</h3>
            <div>
              <p class="font-medium text-white">Known For</p>
              <p>{{ person.known_for_department }}</p>
            </div>
            <div>
              <p class="font-medium text-white">Gender</p>
              <p>{{ person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Not specified' }}</p>
            </div>
            <div v-if="person.birthday">
              <p class="font-medium text-white">Birthday</p>
              <p>{{ person.birthday }} <span v-if="!person.deathday">({{ getAge(person.birthday) }} years old)</span></p>
            </div>
            <div v-if="person.deathday">
              <p class="font-medium text-white">Day of Death</p>
              <p>{{ person.deathday }}</p>
            </div>
            <div v-if="person.place_of_birth">
              <p class="font-medium text-white">Place of Birth</p>
              <p>{{ person.place_of_birth }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex-1">
          <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 text-center md:text-left">{{ person.name }}</h1>
          
          <div v-if="person.biography" class="mb-10">
            <h3 class="text-xl font-bold text-white mb-4">Biography</h3>
            <div class="text-gray-300 leading-relaxed space-y-4">
              <p :class="{ 'line-clamp-6': !expandedBio && isLongBio }">
                {{ person.biography }}
              </p>
              <button 
                v-if="isLongBio" 
                @click="expandedBio = !expandedBio"
                class="text-accent hover:text-accent-hover font-medium flex items-center gap-1 mt-2"
              >
                {{ expandedBio ? 'Read Less' : 'Read More' }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="{'rotate-180': expandedBio}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>
          
          <div v-if="sortedCredits.length > 0">
            <h3 class="text-xl font-bold text-white mb-6">Known For</h3>
            
            <div class="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
              <button 
                v-for="filter in filters" 
                :key="filter.value"
                @click="activeFilter = filter.value"
                class="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors"
                :class="activeFilter === filter.value ? 'bg-white text-black' : 'bg-surface-100 text-gray-300 hover:bg-surface-200'"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              <PosterCard 
                v-for="item in filteredCredits" 
                :key="`${item.media_type}-${item.id}`"
                :item="item"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPerson, profile } from '@/api/tmdb.js'
import PosterCard from '@/components/PosterCard.vue'

const route = useRoute()

const person = ref(null)
const loading = ref(true)
const expandedBio = ref(false)
const activeFilter = ref('all')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' }
]

const isLongBio = computed(() => {
  return person.value?.biography && person.value.biography.length > 500
})

const sortedCredits = computed(() => {
  if (!person.value?.combined_credits?.cast) return []
  // Sort by popularity, highest first
  return [...person.value.combined_credits.cast].sort((a, b) => b.popularity - a.popularity)
})

const filteredCredits = computed(() => {
  if (activeFilter.value === 'all') {
    return sortedCredits.value.slice(0, 20) // Show top 20
  }
  return sortedCredits.value
    .filter(item => item.media_type === activeFilter.value)
    .slice(0, 20)
})

const fetchPerson = async (id) => {
  loading.value = true
  try {
    person.value = await getPerson(id, { append_to_response: 'combined_credits' })
  } catch (error) {
    console.error('Error fetching person:', error)
  } finally {
    loading.value = false
  }
}

const getAge = (birthday) => {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

watch(() => route.params.id, (newId) => {
  if (newId) fetchPerson(newId)
})

onMounted(() => {
  fetchPerson(route.params.id)
})
</script>
