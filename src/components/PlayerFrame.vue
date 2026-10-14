<template>
  <div class="player-wrapper w-full max-w-6xl mx-auto flex flex-col relative">
    <!-- Benchmark Winner Notification Toast -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="benchmarkBanner" 
        class="mb-3 px-4 py-2.5 bg-gradient-to-r from-emerald-950/90 via-[#13110e] to-[#13110e] border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between shadow-xl backdrop-blur-md"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm">🚀</span>
          <span class="font-medium">{{ benchmarkBanner }}</span>
        </div>
        <button @click="benchmarkBanner = ''" class="text-emerald-400 hover:text-white p-1 text-base leading-none">&times;</button>
      </div>
    </transition>

    <!-- Top Compact Stream Quick-Bar -->
    <div class="flex items-center justify-between gap-3 mb-3 px-1 text-xs text-[#c7bfb0]">
      <!-- Quick navigation controls -->
      <div class="flex items-center gap-2">
        <button
          @click="prevProvider"
          class="px-2.5 py-1 rounded-lg bg-[#13110e] hover:bg-[#1c1915] text-[#c7bfb0] hover:text-[#f5efe4] border border-[#f5efe4]/10 transition-all font-mono active:scale-95"
          title="Previous mirror"
        >
          &larr; Prev
        </button>

        <select
          :value="currentProviderId"
          @change="selectProvider($event.target.value)"
          class="bg-[#13110e] text-[#f5efe4] text-xs border border-[#f5efe4]/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#E50914] cursor-pointer max-w-[180px] truncate shadow-sm font-sans"
        >
          <option
            v-for="provider in availableProviders"
            :key="provider.id"
            :value="provider.id"
            class="bg-[#13110e] text-[#f5efe4]"
          >
            {{ provider.name }} {{ getScoreBadge(provider.id) }}
          </option>
        </select>

        <button
          @click="nextProvider"
          class="px-2.5 py-1 rounded-lg bg-[#13110e] hover:bg-[#1c1915] text-[#c7bfb0] hover:text-[#f5efe4] border border-[#f5efe4]/10 transition-all font-mono active:scale-95"
          title="Next mirror"
        >
          Next &rarr;
        </button>
      </div>

      <!-- Right controls: Reload button & live quality info -->
      <div class="flex items-center gap-2.5">
        <span class="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#8a8270] font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          HD 1080p
        </span>

        <button
          @click="reloadPlayer"
          class="px-2.5 py-1 rounded-lg bg-[#13110e] hover:bg-[#1c1915] text-[#c7bfb0] hover:text-[#f5efe4] flex items-center gap-1 border border-[#f5efe4]/10 transition-all active:scale-95 font-mono text-[11px]"
          title="Reload stream player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[#c7bfb0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reload
        </button>
      </div>
    </div>

    <!-- Cinematic Player Stage (Aspect 16:9) with Ambient Bloom -->
    <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(229,9,20,0.18)] border border-[#f5efe4]/10 mb-4">
      <iframe
        v-if="playerUrl && !isReloading"
        :key="`${playerUrl}-${reloadNonce}`"
        :src="playerUrl"
        class="w-full h-full border-0"
        frameborder="0"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *"
        scrolling="no"
        @load="onIframeLoaded"
      ></iframe>
      
      <!-- Cineby Projection Loading Overlay -->
      <transition name="fade">
        <div 
          v-if="isLoading || isReloading" 
          class="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0a08] text-[#c7bfb0] z-20 pointer-events-none"
        >
          <div class="relative flex items-center justify-center mb-4">
            <div class="w-14 h-14 rounded-full border-2 border-[#f5efe4]/10 border-t-[#E50914] animate-spin"></div>
            <div class="w-8 h-8 rounded-full bg-[#E50914]/10 absolute flex items-center justify-center">
              <span class="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.8)]"></span>
            </div>
          </div>
          <span class="font-display text-sm tracking-wide text-[#f5efe4] italic">
            {{ currentLoadingLabel }}
          </span>
          <span class="text-[11px] font-mono text-[#8a8270] mt-1">
            Mirror: {{ activeProviderName }}
          </span>
        </div>
      </transition>
    </div>

    <!-- The Cineby Server Accordion (23 Mirrors + Benchmark Tool) -->
    <ServerAccordion
      :providers="availableProviders"
      :currentProviderId="currentProviderId"
      :serverMetrics="serverMetrics"
      :bestServerId="bestServerId"
      :isTesting="isTestingServers"
      :testingProgress="testingProgress"
      @select="selectProvider"
      @benchmark="handleFindBestServer"
      @openDiagnostics="isDiagnosticsOpen = true"
    />

    <!-- Browser Telemetry & Diagnostics Modal -->
    <DiagnosticsModal
      :isOpen="isDiagnosticsOpen"
      :currentProviderName="activeProviderName"
      @close="isDiagnosticsOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { providers, getProvidersForMediaType } from '@/config/providers.js'
import ServerAccordion from '@/components/ServerAccordion.vue'
import DiagnosticsModal from '@/components/DiagnosticsModal.vue'
import { recordStreamLoad } from '@/composables/useTelemetry.js'
import { 
  serverMetrics, 
  isTestingServers, 
  bestServerId, 
  testingProgress, 
  runServerBenchmark 
} from '@/composables/useServerBenchmark.js'

const route = useRoute()

const props = defineProps({
  tmdbId: {
    type: [Number, String],
    required: true
  },
  mediaType: {
    type: String,
    required: true,
    validator: (value) => ['movie', 'tv', 'anime'].includes(value)
  },
  season: {
    type: [Number, String],
    default: 1
  },
  episode: {
    type: [Number, String],
    default: 1
  },
  initialServer: {
    type: String,
    default: ''
  }
})

const currentProviderId = ref('')
const reloadNonce = ref(0)
const isReloading = ref(false)
const isLoading = ref(true)
const benchmarkBanner = ref('')
const isDiagnosticsOpen = ref(false)
const streamStartTime = ref(Date.now())

// Redflix cinematic loading phrases
const loadingPhrases = [
  'Connecting to Redflix Stream Engine…',
  'Negotiating mirror bitrate…',
  'Optimizing video buffer…',
  'Striking the digital print…'
]
const currentLoadingLabel = ref(loadingPhrases[0])
let phraseInterval = null

const startLoadingPhrases = () => {
  let idx = 0
  if (phraseInterval) clearInterval(phraseInterval)
  phraseInterval = setInterval(() => {
    idx = (idx + 1) % loadingPhrases.length
    currentLoadingLabel.value = loadingPhrases[idx]
  }, 2000)
}

const stopLoadingPhrases = () => {
  if (phraseInterval) {
    clearInterval(phraseInterval)
    phraseInterval = null
  }
}

const availableProviders = computed(() => {
  return getProvidersForMediaType(props.mediaType)
})

const currentProviderIndex = computed(() => {
  return availableProviders.value.findIndex(p => p.id === currentProviderId.value)
})

const activeProviderName = computed(() => {
  const p = availableProviders.value.find(p => p.id === currentProviderId.value)
  return p ? p.name : 'Redflix'
})

const playerUrl = computed(() => {
  if (!currentProviderId.value || !props.tmdbId) return ''
  
  const provider = availableProviders.value.find(p => p.id === currentProviderId.value)
  if (!provider) return ''

  if (props.mediaType === 'anime') {
    if (provider.animeUrl) {
      return provider.animeUrl(props.tmdbId, props.episode || 1)
    }
    return provider.tvUrl ? provider.tvUrl(props.tmdbId, props.season, props.episode) : ''
  } else if (props.mediaType === 'movie') {
    return provider.movieUrl ? provider.movieUrl(props.tmdbId) : ''
  } else {
    return provider.tvUrl ? provider.tvUrl(props.tmdbId, props.season, props.episode) : ''
  }
})

const selectProvider = (id) => {
  if (id === currentProviderId.value) return
  currentProviderId.value = id
  try {
    localStorage.setItem('redflix_preferred_provider', id)
  } catch (e) {}
  isLoading.value = true
  streamStartTime.value = Date.now()
  startLoadingPhrases()
  setTimeout(() => {
    isLoading.value = false
    stopLoadingPhrases()
  }, 2200)
}

const prevProvider = () => {
  const idx = currentProviderIndex.value
  const newIdx = idx > 0 ? idx - 1 : availableProviders.value.length - 1
  selectProvider(availableProviders.value[newIdx].id)
}

const nextProvider = () => {
  const idx = currentProviderIndex.value
  const newIdx = idx < availableProviders.value.length - 1 ? idx + 1 : 0
  selectProvider(availableProviders.value[newIdx].id)
}

const reloadPlayer = () => {
  isReloading.value = true
  isLoading.value = true
  streamStartTime.value = Date.now()
  startLoadingPhrases()
  reloadNonce.value++
  setTimeout(() => {
    isReloading.value = false
  }, 100)
  setTimeout(() => {
    isLoading.value = false
    stopLoadingPhrases()
  }, 2000)
}

const onIframeLoaded = () => {
  const elapsed = Math.round(Date.now() - streamStartTime.value)
  recordStreamLoad(currentProviderId.value, activeProviderName.value, playerUrl.value, elapsed, true)
  setTimeout(() => {
    isLoading.value = false
    stopLoadingPhrases()
  }, 600)
}

const getScoreBadge = (id) => {
  const m = serverMetrics[id]
  if (!m || m.score === null) return ''
  if (m.iframeBlocked) return '(Blocked)'
  if (m.score === 0) return '(Failed)'
  return `(${m.score}pts)`
}

const handleFindBestServer = async () => {
  benchmarkBanner.value = `Running live video buffer speed test across all ${availableProviders.value.length} mirrors...`
  const result = await runServerBenchmark(
    props.tmdbId,
    props.mediaType,
    props.season,
    props.episode
  )

  if (result.winner) {
    benchmarkBanner.value = `Switched to fastest mirror: ${result.winner.name} (Latency: ${result.winner.latency}ms | Buffer: ${result.winner.bufferSpeed} | Score: ${result.winner.score}/100)`
    selectProvider(result.winner.id)
  } else {
    benchmarkBanner.value = 'Benchmark complete. Check scores next to each mirror.'
  }
}

onMounted(() => {
  startLoadingPhrases()

  // 1. Check prop or URL query parameter first (e.g. ?server=vidbolt)
  const queryServer = props.initialServer || (route.query && (route.query.server || route.query.source))
  let targetServer = null

  if (queryServer && availableProviders.value.some(p => p.id === queryServer)) {
    targetServer = queryServer
  } else {
    // 2. Check localStorage
    const saved = localStorage.getItem('redflix_preferred_provider') || localStorage.getItem('cineby_preferred_provider')
    if (saved && availableProviders.value.some(p => p.id === saved) && saved !== 'vidsrc-su') {
      targetServer = saved
    } else {
      // 3. Default to official primary Redflix server
      if (props.mediaType === 'anime') {
        targetServer = 'vidbolt-sub'
      } else {
        targetServer = 'vidbolt' // Official Redflix primary default
      }
    }
  }

  currentProviderId.value = targetServer
  
  setTimeout(() => {
    isLoading.value = false
    stopLoadingPhrases()
  }, 2200)
})

onUnmounted(() => {
  stopLoadingPhrases()
})
</script>
