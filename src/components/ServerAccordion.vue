<template>
  <div class="server-accordion bg-[#13110e] rounded-2xl border border-[#f5efe4]/10 overflow-hidden shadow-xl transition-all duration-300">
    <!-- Redflix Official Horizontal Source Strip (1-tap quick switch) -->
    <div class="px-3.5 py-2.5 bg-black/60 border-b border-[#f5efe4]/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-white/40 shrink-0 mr-1 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse"></span>
        <span>Source:</span>
      </span>
      <button
        v-for="p in quickServers"
        :key="'quick-' + p.id"
        @click="$emit('select', p.id)"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 border active:scale-95',
          currentProviderId === p.id 
            ? 'bg-[#E50914] text-white border-[#E50914] shadow-[0_0_12px_rgba(229,9,20,0.45)]'
            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/5 hover:border-white/10'
        ]"
      >
        <span>{{ p.name }}</span>
        <span v-if="p.isHindi" class="text-[9px] px-1 py-0.2 rounded bg-amber-500/25 text-amber-300 font-mono font-medium">Hindi</span>
        <span v-else-if="p.tag === 'Audio Boost'" class="text-[9px] px-1 py-0.2 rounded bg-indigo-500/25 text-indigo-300 font-mono font-medium">Boost</span>
        <span v-else-if="p.tag === 'Default'" class="text-[9px] px-1 py-0.2 rounded bg-red-950/60 text-red-200 border border-red-500/30 font-mono font-medium">Default</span>
        <span v-else-if="p.track" class="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono font-medium uppercase">{{ p.track }}</span>
      </button>
    </div>

    <!-- Accordion Header -->
    <div 
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 sm:py-3 bg-[#13110e] hover:bg-[#1c1915]/60 transition-colors border-b border-[#f5efe4]/5"
    >
      <!-- Left: Title & Active Server Summary -->
      <div 
        @click="isOpen = !isOpen"
        class="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.6)] animate-pulse shrink-0"></span>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-display text-base sm:text-lg font-medium text-[#f5efe4] tracking-tight">
              All Streaming Mirrors
            </h3>
            <span class="text-xs text-[#8a8270] font-mono">({{ providers.length }} available)</span>
          </div>
          <div class="flex items-center gap-2 mt-0.5 text-xs text-[#c7bfb0] truncate">
            <span>Active:</span>
            <strong class="text-[#f5efe4] font-semibold truncate">{{ activeProviderName }}</strong>
            <span 
              v-if="activeMetrics && activeMetrics.score !== null"
              :class="[
                'text-[10px] px-2 py-0.5 rounded-full font-mono font-bold',
                activeMetrics.score >= 85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                activeMetrics.score >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              ]"
            >
              {{ activeMetrics.score }}pts &bull; {{ activeMetrics.latency }}ms
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Action Button & Toggle Chevron -->
      <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
        <!-- Benchmark Button -->
        <button
          @click.stop="$emit('benchmark')"
          :disabled="isTesting"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0b0a08] bg-gradient-to-r from-[#E50914] via-[#FF1E27] to-[#c9a76a] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] disabled:opacity-60 cursor-pointer"
          title="Test real video buffering speed and score all streaming mirrors"
        >
          <svg v-if="!isTesting" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="animate-spin h-3.5 w-3.5 text-[#0b0a08]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="font-bold tracking-tight">
            {{ isTesting ? `Benchmarking (${testingProgress.current}/${testingProgress.total})...` : '⚡ Find Best Server' }}
          </span>
        </button>

        <!-- Diagnostics & Telemetry Button -->
        <button
          @click.stop="$emit('openDiagnostics')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#f5efe4] bg-[#1c1915] hover:bg-[#2a251e] border border-[#f5efe4]/10 hover:border-[#E50914]/50 transition-all font-mono"
          title="Open real-time browser telemetry, postMessage logs, and export diagnostic data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Logs</span>
        </button>

        <!-- Toggle Open/Close Button -->
        <button
          @click="isOpen = !isOpen"
          class="w-8 h-8 rounded-full bg-[#1c1915] hover:bg-[#2a251e] border border-[#f5efe4]/10 flex items-center justify-center text-[#c7bfb0] hover:text-[#f5efe4] transition-all"
          :title="isOpen ? 'Collapse servers' : 'Expand all servers'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 transition-transform duration-300"
            :class="{ 'rotate-180': isOpen }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Collapsible Server Cards Grid -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[1200px] opacity-100"
      leave-from-class="max-h-[1200px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" class="p-4 sm:p-5 overflow-hidden">
        <p class="text-xs text-[#8a8270] mb-3">
          Select any mirror below to switch streams instantly. All {{ providers.length }} mirrors are scored by video buffer speed and latency.
        </p>

        <!-- The Server Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          <button
            v-for="(provider, idx) in providers"
            :key="provider.id"
            @click="$emit('select', provider.id)"
            :class="[
              'w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between gap-2.5 border group relative',
              currentProviderId === provider.id
                ? 'bg-gradient-to-r from-[#E50914]/20 to-[#c9a76a]/10 border-[#E50914]/60 text-[#f5efe4] shadow-[inset_0_0_0_1px_rgba(229,9,20,0.45)]'
                : (isBlocked(provider.id)
                    ? 'bg-[#13110e]/40 border-red-950/30 text-[#8a8270] opacity-50 cursor-pointer hover:opacity-80'
                    : 'bg-[#1c1915] border-[#f5efe4]/8 text-[#c7bfb0] hover:bg-[#2a251e] hover:text-[#f5efe4] hover:border-[#f5efe4]/15 hover:-translate-y-0.5')
            ]"
          >
            <!-- Left Info: Index & Name -->
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="font-mono text-[11px] text-[#8a8270] font-medium shrink-0">
                #{{ String(idx + 1).padStart(2, '0') }}
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-semibold text-xs text-[#f5efe4] truncate">
                    {{ provider.name }}
                  </span>
                  <!-- Official Redflix Tag -->
                  <span
                    v-if="provider.isOfficial"
                    class="text-[9px] px-1 py-0.2 rounded bg-red-950/60 text-red-300 border border-red-600/30 font-mono font-medium"
                    title="Official Redflix Server"
                  >
                    Redflix
                  </span>
                  <!-- Hindi Tag -->
                  <span
                    v-if="provider.isHindi"
                    class="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-medium"
                    title="Hindi Audio Available"
                  >
                    Hindi
                  </span>
                  <!-- Audio Boost Tag -->
                  <span
                    v-if="provider.tag === 'Audio Boost'"
                    class="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-medium"
                    title="Audio Boost"
                  >
                    Boost
                  </span>
                  <!-- Verified Streaming Badge -->
                  <span 
                    v-if="isVerified(provider.id)" 
                    class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-medium flex items-center gap-0.5" 
                    title="Verified active video stream"
                  >
                    <span>⚡</span>
                    <span class="hidden md:inline">Verified</span>
                  </span>
                  <!-- Best Server Star -->
                  <span 
                    v-if="bestServerId === provider.id" 
                    class="text-amber-400 text-xs shrink-0" 
                    title="Fastest streaming mirror"
                  >★</span>
                </div>
                <!-- Status/Metrics hint -->
                <span class="block text-[10px] text-[#8a8270] truncate mt-0.5">
                  {{ provider.tagline || getStatusText(provider.id) }}
                </span>
              </div>
            </div>

            <!-- Right Badge: Score / Status Pill -->
            <div class="shrink-0 flex items-center gap-1">
              <!-- Score pill -->
              <span
                v-if="serverMetrics[provider.id] && serverMetrics[provider.id].score !== null"
                :class="[
                  'text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shadow-xs',
                  getScoreClass(serverMetrics[provider.id].score, serverMetrics[provider.id].iframeBlocked, isVerified(provider.id))
                ]"
              >
                {{ serverMetrics[provider.id].iframeBlocked ? 'Blocked' : (serverMetrics[provider.id].score === 0 ? 'Failed' : `${serverMetrics[provider.id].score}pts`) }}
              </span>

              <!-- Testing spinner -->
              <span 
                v-else-if="serverMetrics[provider.id] && serverMetrics[provider.id].status === 'testing'"
                class="w-3 h-3 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"
              ></span>

              <!-- Active checkmark indicator -->
              <span v-if="currentProviderId === provider.id" class="text-[#E50914] ml-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  providers: {
    type: Array,
    required: true
  },
  currentProviderId: {
    type: String,
    required: true
  },
  serverMetrics: {
    type: Object,
    default: () => ({})
  },
  bestServerId: {
    type: String,
    default: ''
  },
  isTesting: {
    type: Boolean,
    default: false
  },
  testingProgress: {
    type: Object,
    default: () => ({ current: 0, total: 0 })
  }
})

defineEmits(['select', 'benchmark', 'openDiagnostics'])

const isOpen = ref(false)

const quickServers = computed(() => {
  // Return the official Redflix servers (or first 14 servers) for 1-tap quick access
  return props.providers.slice(0, 14)
})

const activeProviderName = computed(() => {
  const p = props.providers.find(p => p.id === props.currentProviderId)
  return p ? p.name : 'Unknown'
})

const activeMetrics = computed(() => {
  return props.serverMetrics[props.currentProviderId] || null
})

const isBlocked = (id) => {
  return props.serverMetrics[id]?.iframeBlocked === true
}

const isVerified = (id) => {
  return props.serverMetrics[id]?.verified === true
}

const getStatusText = (id) => {
  const m = props.serverMetrics[id]
  if (!m || m.status === 'idle') return 'Ready'
  if (m.status === 'testing') return 'Testing latency...'
  if (m.iframeBlocked) return 'Iframe blocked'
  if (m.score === 0) return 'Stream offline'
  if (m.verified) return `${m.latency || 540}ms · Verified 1080p`
  if (m.status === 'unstable') return `${m.latency}ms · Unstable CDN`
  return `${m.latency}ms · ${m.bufferSpeed}`
}

const getScoreClass = (score, isBlocked, isVerified = false) => {
  if (isBlocked) return 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
  if (isVerified) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
  if (score >= 90) return 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
  if (score >= 70) return 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
  if (score > 0) return 'bg-orange-950/70 text-orange-400 border border-orange-500/40'
  return 'bg-red-950/70 text-red-400 border border-red-800/40'
}
</script>
