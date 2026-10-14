<template>
  <div class="filter-panel bg-surface-100 p-4 rounded-lg shadow-lg mb-8 border border-surface-200">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <!-- Genres Selector -->
      <div class="flex-1">
        <h3 class="text-gray-400 text-sm font-medium mb-2">Genres</h3>
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectGenre(null)"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
              !modelValue.genre 
                ? 'bg-accent border-accent text-white' 
                : 'bg-surface-200 border-surface-300 text-gray-300 hover:border-accent hover:text-white'
            ]"
          >
            All
          </button>
          <button
            v-for="genre in genres"
            :key="genre.id"
            @click="selectGenre(genre.id)"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
              modelValue.genre === genre.id 
                ? 'bg-accent border-accent text-white' 
                : 'bg-surface-200 border-surface-300 text-gray-300 hover:border-accent hover:text-white'
            ]"
          >
            {{ genre.name }}
          </button>
        </div>
      </div>

      <!-- Sort Selector -->
      <div class="md:w-48 shrink-0">
        <h3 class="text-gray-400 text-sm font-medium mb-2">Sort By</h3>
        <div class="relative">
          <select
            :value="modelValue.sort"
            @input="updateSort($event.target.value)"
            class="w-full bg-surface-200 text-white border border-surface-300 rounded-md py-2 px-3 appearance-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer text-sm"
          >
            <option value="popularity.desc">Popularity (High-Low)</option>
            <option value="popularity.asc">Popularity (Low-High)</option>
            <option value="vote_average.desc">Rating (High-Low)</option>
            <option value="primary_release_date.desc">Release Date (New-Old)</option>
            <option value="primary_release_date.asc">Release Date (Old-New)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  genres: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectGenre = (genreId) => {
  emit('update:modelValue', {
    ...props.modelValue,
    genre: genreId
  })
}

const updateSort = (sortValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    sort: sortValue
  })
}
</script>
