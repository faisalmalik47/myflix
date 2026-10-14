<template>
  <div class="px-4 md:px-8 pt-20 pb-16 min-h-screen">
    <!-- Back Navigation Bar -->
    <div class="max-w-6xl mx-auto mb-4 flex items-center justify-between">
      <button 
        @click="$router.back()"
        class="inline-flex items-center gap-2 text-xs font-semibold text-bone-300 hover:text-white px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 transition-colors"
      >
        <span>&larr;</span>
        <span>Back</span>
      </button>

      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
        <span class="text-xs font-mono text-bone-400 uppercase tracking-wider">
          MyFlix Stream Engine
        </span>
      </div>
    </div>

    <!-- Main Player Frame -->
    <div v-if="mediaId" class="max-w-6xl mx-auto">
      <PlayerFrame
        :tmdbId="mediaId"
        :mediaType="mediaType"
        :season="season"
        :episode="episode"
        :initialServer="initialServer"
      />
    </div>

    <div v-else class="text-center py-20 text-bone-400">
      Invalid media identifier. Please select a title to watch.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PlayerFrame from '@/components/PlayerFrame.vue'

const route = useRoute()

const mediaId = computed(() => route.query.id || route.params.id)
const mediaType = computed(() => route.query.type || route.params.mediaType || 'movie')
const season = computed(() => Number(route.query.s || route.query.season || route.params.season || 1))
const episode = computed(() => Number(route.query.e || route.query.episode || route.params.episode || 1))
const initialServer = computed(() => String(route.query.server || route.query.source || ''))
</script>
