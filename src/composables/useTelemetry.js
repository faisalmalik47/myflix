import { reactive, ref } from 'vue'

// Known streaming iframe origins mapped to Redflix provider IDs
export const ORIGIN_TO_PROVIDER = {
  'https://vidbolt.xyz': 'vidbolt',
  'https://embed.filmu.in': 'filmu',
  'https://player.videasy.to': 'videasy',
  'https://player.videasy.net': 'videasy',
  'https://videasy.net': 'videasy',
  'https://vidlink.pro': 'vidlink',
  'https://vidfast.vc': 'vidfast',
  'https://embed.vidrift.in': 'vidrift',
  'https://playapi.co': 'playapi',
  'https://vidcore.net': 'vidcore',
  'https://screenscape.me': 'screenscape',
  'https://embed.reelsdownload.online': 'hindi-new',
  'https://player.cinezo.live': 'cinezo',
  'https://vidup.to': 'vidup',
  'https://api.zxcstream.xyz': 'zxcstream',
  'https://peachify.top': 'peachify',
  'https://vidrock.net': 'vidrock',
  'https://orion.vares.top': 'vares',
  'https://tryembed.us.cc': 'tryembed',
  'https://megaplay.buzz': 'megaplay',
  'https://vidnest.fun': 'vidnest',
  'https://cinemaos.tech': 'cinemaos',
  'https://cinemaos.live': 'cinemaos-live',
  'https://autoembed.co': 'autoembed-co',
  'https://vidsrc.pm': 'vidsrc-pm',
  'https://vidsrc.to': 'vidsrc-to',
  'https://vidsrc.su': 'vidsrc-su',
  'https://vidsrc.xyz': 'vidsrc-xyz',
  'https://vidsrc.me': 'vidsrc-me',
  'https://vidsrc.io': 'vidsrc-io',
  'https://vidsrc.icu': 'vidsrc-icu',
  'https://vidsrc.cc': 'vidsrc-cc',
  'https://vidsrc.net': 'vidsrc-net',
  'https://embed.su': 'embed-su',
  'https://player.autoembed.cc': 'autoembed',
  'https://player.smashy.stream': 'smashystream',
  'https://rive.stream': 'rivestream',
  'https://frembed.icu': 'frembed',
  'https://2embed.cc': '2embed-cc',
  'https://www.2embed.skin': '2embed-skin'
}

// Global in-memory log buffer for real-time telemetry capture
export const telemetryLogs = reactive({
  events: [],
  playerMessages: [],
  networkTimings: [],
  errors: [],
  benchmarks: []
})

// Persistent store of verified providers that have dispatched real video playback events
const savedVerified = (() => {
  try {
    const raw = localStorage.getItem('cineby_verified_providers')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
})()

export const verifiedProviders = reactive({
  // Seed with VidLink and Videasy based on verified telemetry from user session
  vidlink: {
    name: 'VidLink Pro',
    origin: 'https://vidlink.pro',
    lastEvent: 'timeupdate',
    eventCount: 20,
    verifiedAt: new Date().toISOString(),
    isStreaming: true
  },
  videasy: {
    name: 'Videasy Fast',
    origin: 'https://player.videasy.net',
    lastEvent: 'MEDIA_DATA',
    eventCount: 5,
    verifiedAt: new Date().toISOString(),
    isStreaming: true
  },
  ...savedVerified
})

export const isTelemetryRecording = ref(true)

// Register a verified stream playback event from an iframe origin
export function registerVerifiedPlayback(origin, data) {
  const providerId = ORIGIN_TO_PROVIDER[origin] || Object.keys(ORIGIN_TO_PROVIDER).find(k => origin.includes(k.replace('https://', '')))
  if (!providerId) return

  const eventName = data?.data?.event || data?.type || 'active'
  const isPlaybackActive = ['play', 'playing', 'timeupdate', 'MEDIA_DATA'].includes(eventName)

  if (isPlaybackActive) {
    if (!verifiedProviders[providerId]) {
      verifiedProviders[providerId] = {
        name: providerId,
        origin,
        lastEvent: eventName,
        eventCount: 0,
        verifiedAt: new Date().toISOString(),
        isStreaming: true
      }
    }
    verifiedProviders[providerId].lastEvent = eventName
    verifiedProviders[providerId].eventCount++
    verifiedProviders[providerId].isStreaming = true
    verifiedProviders[providerId].lastTimestamp = new Date().toISOString()

    try {
      localStorage.setItem('cineby_verified_providers', JSON.stringify(verifiedProviders))
    } catch {
      // Ignore quota errors
    }
  }
}

// Helper to push timestamped log
export function logEvent(type, data) {
  if (!isTelemetryRecording.value) return
  const entry = {
    timestamp: new Date().toISOString(),
    epoch: Date.now(),
    type,
    ...data
  }
  telemetryLogs.events.unshift(entry)
  if (telemetryLogs.events.length > 200) {
    telemetryLogs.events.pop()
  }
}

/**
 * Initialize browser listener for postMessage events from streaming iframes
 * Video players (VidLink, JWPlayer, Plyr, VdoCipher, etc.) emit postMessages for play, pause, error, etc.
 */
export function initBrowserTelemetry() {
  if (typeof window === 'undefined') return

  // Listen for iframe embed postMessages
  window.addEventListener('message', (event) => {
    try {
      // Ignore Vue devtools or noise
      if (typeof event.data === 'string' && event.data.includes('vue-devtools')) return

      const logItem = {
        timestamp: new Date().toISOString(),
        origin: event.origin,
        data: typeof event.data === 'object' ? JSON.parse(JSON.stringify(event.data)) : event.data
      }

      telemetryLogs.playerMessages.unshift(logItem)
      if (telemetryLogs.playerMessages.length > 100) {
        telemetryLogs.playerMessages.pop()
      }

      logEvent('iframe_message', { origin: event.origin, data: logItem.data })

      // Auto-learn: check if this message verifies video playback
      registerVerifiedPlayback(event.origin, logItem.data)
    } catch {
      // Ignore unparseable data
    }
  })

  // Capture global JavaScript errors
  window.addEventListener('error', (event) => {
    const errorData = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
    telemetryLogs.errors.unshift(errorData)
    logEvent('browser_error', errorData)
  })

  // Expose global debug object on window for developer console inspection
  window.__cinebyTelemetry = {
    getLogs: () => JSON.parse(JSON.stringify(telemetryLogs)),
    copyLogs: () => copyTelemetryReport(),
    exportLogs: () => exportTelemetryReport(),
    clearLogs: () => clearTelemetry(),
    verified: verifiedProviders
  }
}

/**
 * Record a stream attempt with start/load/error timing
 */
export function recordStreamLoad(providerId, providerName, url, durationMs, success = true, error = null) {
  const record = {
    providerId,
    providerName,
    url,
    durationMs,
    success,
    error,
    timestamp: new Date().toISOString()
  }
  logEvent('stream_load', record)
}

/**
 * Capture recent performance resource timings for streaming domains
 */
export function captureResourceTimings() {
  if (typeof window === 'undefined' || !window.performance) return []
  
  const resources = window.performance.getEntriesByType('resource')
  const streamingTimings = resources.map(r => ({
    name: r.name,
    initiatorType: r.initiatorType,
    duration: Math.round(r.duration),
    transferSize: r.transferSize || 0,
    startTime: Math.round(r.startTime)
  })).slice(-40) // last 40 resources

  telemetryLogs.networkTimings = streamingTimings
  return streamingTimings
}

/**
 * Generate a complete diagnostic dump in JSON
 */
export function generateDiagnosticReport() {
  captureResourceTimings()
  return {
    cinebyVersion: '1.2.0',
    exportTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio
    },
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null,
    totalEvents: telemetryLogs.events.length,
    recentEvents: telemetryLogs.events.slice(0, 50),
    playerMessages: telemetryLogs.playerMessages.slice(0, 30),
    networkTimings: telemetryLogs.networkTimings.slice(0, 30),
    errors: telemetryLogs.errors
  }
}

/**
 * Copy formatted JSON to clipboard for instant pasting to the AI Assistant
 */
export async function copyTelemetryReport() {
  const report = generateDiagnosticReport()
  const text = JSON.stringify(report, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    return { success: true, message: 'Diagnostic telemetry copied to clipboard!' }
  } catch {
    return { success: false, message: 'Could not copy to clipboard. Use Download instead.' }
  }
}

/**
 * Export and trigger file download of cineby-telemetry.json
 */
export function exportTelemetryReport() {
  const report = generateDiagnosticReport()
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', dataStr)
  downloadAnchor.setAttribute('download', `cineby-telemetry-${Date.now()}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

/**
 * Clear captured logs
 */
export function clearTelemetry() {
  telemetryLogs.events = []
  telemetryLogs.playerMessages = []
  telemetryLogs.networkTimings = []
  telemetryLogs.errors = []
  telemetryLogs.benchmarks = []
}

/**
 * Return computed insights based on accumulated browser telemetry
 */
export function getTelemetryInsights() {
  const verifiedList = Object.entries(verifiedProviders).map(([id, info]) => ({
    id,
    ...info
  }))

  // Find latest player event
  const latestPlayerMsg = telemetryLogs.playerMessages.find(m => m.data?.type === 'PLAYER_EVENT')
  const playbackDetails = latestPlayerMsg?.data?.data || null

  return {
    verifiedCount: verifiedList.length,
    verifiedList,
    playbackDetails,
    totalEvents: telemetryLogs.events.length,
    hasActivePlayback: verifiedList.some(v => v.isStreaming)
  }
}

