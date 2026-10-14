<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    leave-active-class="transition duration-150 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      @click.self="$emit('close')"
    >
      <div class="relative w-full max-w-2xl bg-[#13110e] border border-[#f5efe4]/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-[#f5efe4]/10 flex items-center justify-between bg-[#1c1915]">
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-[#E50914] animate-pulse"></span>
            <h3 class="font-display text-lg text-[#f5efe4] font-medium tracking-tight">
              Browser Telemetry & Diagnostics
            </h3>
          </div>
          <button 
            @click="$emit('close')" 
            class="w-8 h-8 rounded-full bg-[#13110e] hover:bg-[#2a251e] border border-[#f5efe4]/10 flex items-center justify-center text-[#c7bfb0] hover:text-[#f5efe4] transition-all"
          >
            &times;
          </button>
        </div>

        <!-- Modal Body / Tabs -->
        <div class="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#c7bfb0]">
          <!-- Top Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div class="p-3 rounded-xl bg-[#1c1915] border border-[#f5efe4]/8">
              <span class="text-[#8a8270] block font-mono text-[10px] uppercase">Active Mirror</span>
              <strong class="text-[#f5efe4] truncate block mt-0.5">{{ currentProviderName || 'None' }}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1c1915] border border-[#f5efe4]/8">
              <span class="text-[#8a8270] block font-mono text-[10px] uppercase">Recorded Events</span>
              <strong class="text-[#E50914] font-mono text-sm block mt-0.5">{{ telemetryLogs.events.length }}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1c1915] border border-[#f5efe4]/8">
              <span class="text-[#8a8270] block font-mono text-[10px] uppercase">Player Messages</span>
              <strong class="text-emerald-400 font-mono text-sm block mt-0.5">{{ telemetryLogs.playerMessages.length }}</strong>
            </div>
            <div class="p-3 rounded-xl bg-[#1c1915] border border-[#f5efe4]/8">
              <span class="text-[#8a8270] block font-mono text-[10px] uppercase">Errors</span>
              <strong :class="telemetryLogs.errors.length > 0 ? 'text-rose-400' : 'text-emerald-400'" class="font-mono text-sm block mt-0.5">
                {{ telemetryLogs.errors.length }}
              </strong>
            </div>
          </div>

          <!-- AI Telemetry & Stream Learning Insights -->
          <div class="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#1c1915] to-[#1c1915] border border-emerald-500/30 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm">🧠</span>
                <h4 class="font-display font-semibold text-xs text-[#f5efe4]">
                  AI Telemetry & Mirror Intelligence
                </h4>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {{ verifiedList.length }} Verified Mirrors
              </span>
            </div>
            
            <p class="text-[11px] text-[#c7bfb0] leading-relaxed">
              <span v-if="latestPlayback">
                Stream playback is active: <strong class="text-emerald-400 font-mono">{{ currentProviderName }}</strong> (progress: {{ Math.round(latestPlayback.currentTime || 0) }}s / {{ Math.round((latestPlayback.duration || 0) / 60) }} min).
              </span>
              <span v-else>
                Listening to real player buffer events and postMessages from the active streaming iframe.
              </span>
            </p>

            <!-- Verified Mirrors Pills -->
            <div class="flex items-center gap-1.5 flex-wrap pt-1">
              <span class="text-[10px] text-[#8a8270] font-mono">Proven Working:</span>
              <span 
                v-for="v in verifiedList" 
                :key="v.id"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#13110e] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {{ v.name || v.id }} ({{ v.eventCount }} events)
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-2 flex-wrap pt-1">
            <button
              @click="handleCopy"
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FF1E27] text-[#0b0a08] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:brightness-110 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{{ copyStatus || '📋 Copy Report for Assistant' }}</span>
            </button>

            <button
              @click="exportTelemetryReport"
              class="px-3.5 py-2 rounded-xl bg-[#1c1915] hover:bg-[#2a251e] border border-[#f5efe4]/10 text-[#f5efe4] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8a8270]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>💾 Download JSON</span>
            </button>

            <button
              @click="clearTelemetry"
              class="px-3 py-2 rounded-xl bg-[#1c1915] hover:bg-[#2a251e] border border-[#f5efe4]/10 text-[#8a8270] hover:text-[#f5efe4] text-xs transition-all ml-auto"
            >
              Clear
            </button>
          </div>

          <!-- Recent Events Log Stream -->
          <div class="space-y-2">
            <h4 class="font-mono text-[11px] uppercase tracking-wider text-[#8a8270]">
              Recent Activity & Player Events
            </h4>
            
            <div class="bg-[#0b0a08] border border-[#f5efe4]/8 rounded-xl p-3 max-h-56 overflow-y-auto font-mono text-[11px] space-y-1.5 no-scrollbar">
              <div 
                v-for="(evt, i) in telemetryLogs.events.slice(0, 25)" 
                :key="i"
                class="flex items-start gap-2 border-b border-[#f5efe4]/5 pb-1"
              >
                <span class="text-[#8a8270] shrink-0">[{{ evt.timestamp.split('T')[1].slice(0, 8) }}]</span>
                <span 
                  :class="[
                    'px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0',
                    evt.type === 'stream_load' ? 'bg-cyan-950 text-cyan-400' :
                    evt.type === 'iframe_message' ? 'bg-emerald-950 text-emerald-400' :
                    evt.type === 'browser_error' ? 'bg-rose-950 text-rose-400' :
                    'bg-amber-950 text-amber-400'
                  ]"
                >
                  {{ evt.type }}
                </span>
                <span class="text-[#c7bfb0] truncate">
                  {{ evt.providerName ? `${evt.providerName} (${evt.durationMs}ms)` : JSON.stringify(evt.data || evt.message || '') }}
                </span>
              </div>
              <div v-if="telemetryLogs.events.length === 0" class="text-[#8a8270] text-center py-4">
                No telemetry recorded yet. Browse servers or test streams to generate logs.
              </div>
            </div>
          </div>

          <!-- How to Debug Guide -->
          <div class="p-3.5 rounded-xl bg-[#1c1915] border border-[#f5efe4]/8 space-y-2">
            <h5 class="font-display font-medium text-[#f5efe4] text-xs">
              💡 How to capture browser data for the AI Assistant:
            </h5>
            <ol class="list-decimal list-inside space-y-1 text-[11px] text-[#8a8270] leading-relaxed">
              <li>Click different servers or play a video.</li>
              <li>Click <strong class="text-[#f5efe4]">"📋 Copy Report for Assistant"</strong> above.</li>
              <li>Paste it right here into our chat so I can analyze the exact network response, latency, and errors!</li>
              <li>Or in Chrome/Brave/Edge: Press <kbd class="font-mono bg-[#0b0a08] px-1 rounded text-[#f5efe4]">F12</kbd> &rarr; <strong>Network</strong> tab &rarr; Click the <strong>Export HAR</strong> icon.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  telemetryLogs, 
  verifiedProviders,
  copyTelemetryReport, 
  exportTelemetryReport, 
  clearTelemetry 
} from '@/composables/useTelemetry.js'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentProviderName: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])

const copyStatus = ref('')

const verifiedList = computed(() => {
  return Object.entries(verifiedProviders).map(([id, info]) => ({
    id,
    name: info.name || id,
    eventCount: info.eventCount || 0,
    lastEvent: info.lastEvent || 'active'
  }))
})

const latestPlayback = computed(() => {
  const match = telemetryLogs.playerMessages.find(m => m.data?.type === 'PLAYER_EVENT' && m.data?.data)
  return match?.data?.data || null
})

const handleCopy = async () => {
  const res = await copyTelemetryReport()
  copyStatus.value = res.success ? '✅ Copied to Clipboard!' : 'Failed to copy'
  setTimeout(() => {
    copyStatus.value = ''
  }, 2500)
}
</script>
