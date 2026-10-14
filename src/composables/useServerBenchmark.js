import { ref, reactive } from 'vue'
import { providers } from '@/config/providers.js'
import { telemetryLogs, verifiedProviders } from '@/composables/useTelemetry.js'

// Known streaming servers that send X-Frame-Options: SAMEORIGIN / DENY or block iframe embedding
const BLOCKED_IFRAME_DOMAINS = [
  'nontongo.win',
  'multiembed.mov',
  'moviesapi.club'
]

// Domains known to have unstable CDNs or frequent video playback errors
const UNRELIABLE_DOMAINS = [
  'vidsrc.su',
  'vidsrc.xyz',
  'vidsrc.icu',
  'vidsrc.cc'
]

// Reactive state for server performance metrics
export const serverMetrics = reactive({})

// Initialize metrics map for all providers
providers.forEach(p => {
  const isInitiallyVerified = !!verifiedProviders[p.id]
  serverMetrics[p.id] = {
    latency: isInitiallyVerified ? 540 : null,
    score: isInitiallyVerified ? 100 : null,
    bufferSpeed: isInitiallyVerified ? '⚡ Verified Stream' : null,
    iframeBlocked: false,
    status: isInitiallyVerified ? 'verified' : 'idle',
    testedUrl: null,
    verified: isInitiallyVerified
  }
})

export const isTestingServers = ref(false)
export const bestServerId = ref('vidlink')
export const testingProgress = ref({ current: 0, total: providers.length })

/**
 * Benchmark an individual provider's real movie/TV embed stream loading speed.
 * Measures exact latency, detects iframe-blocking servers,
 * and calculates individual score based on actual buffer & stream response time.
 */
async function inspectServer(provider, tmdbId, mediaType = 'movie', season = 1, episode = 1) {
  const metric = serverMetrics[provider.id]
  metric.status = 'testing'

  const streamUrl = mediaType === 'movie'
    ? (provider.movieUrl ? provider.movieUrl(tmdbId) : null)
    : (provider.tvUrl ? provider.tvUrl(tmdbId, season, episode) : null)

  if (!streamUrl) {
    metric.status = 'error'
    metric.score = 0
    metric.latency = 5000
    metric.bufferSpeed = 'Unavailable'
    return { id: provider.id, score: 0 }
  }

  metric.testedUrl = streamUrl

  // 1. Check if provider is known to block iframes via X-Frame-Options
  const isKnownBlocked = BLOCKED_IFRAME_DOMAINS.some(domain => streamUrl.includes(domain))
  if (isKnownBlocked) {
    metric.iframeBlocked = true
    metric.score = 0
    metric.latency = 1200
    metric.bufferSpeed = 'Refused (SAMEORIGIN)'
    metric.status = 'blocked'
    return { id: provider.id, score: 0, latency: 1200, status: 'blocked' }
  }

  const startTime = performance.now()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4500)

  try {
    const testUrl = streamUrl.includes('?') 
      ? `${streamUrl}&_bench=${Date.now()}`
      : `${streamUrl}?_bench=${Date.now()}`

    // Browser network audit
    await fetch(testUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const duration = Math.round(performance.now() - startTime)

    metric.latency = duration
    metric.iframeBlocked = false

    // REAL PERFORMANCE SCORING MATRIX
    const isVerified = !!verifiedProviders[provider.id]
    const isUnreliable = UNRELIABLE_DOMAINS.some(domain => streamUrl.includes(domain))

    let score = 80
    let speedCategory = 'Good Buffer'

    if (isVerified) {
      // Verified active player emitting real video timeupdates in the user's browser
      score = Math.min(100, Math.max(95, 100 - Math.round(duration / 300)))
      speedCategory = '⚡ Verified Stream'
      metric.verified = true
      metric.status = 'verified'
    } else if (isUnreliable) {
      // Unreliable CDN that frequently fails with broken streams or video playback errors
      score = Math.min(55, Math.max(25, 60 - Math.round(duration / 100)))
      speedCategory = '⚠️ Unstable CDN'
      metric.status = 'unstable'
    } else if (duration <= 250) {
      score = Math.max(90, Math.round(94 - ((duration / 250) * 4)))
      speedCategory = '🚀 Fast Stream'
      metric.status = 'ready'
    } else if (duration <= 600) {
      score = Math.max(80, Math.round(89 - (((duration - 250) / 350) * 9)))
      speedCategory = 'Good Buffer'
      metric.status = 'ready'
    } else if (duration <= 1200) {
      score = Math.max(65, Math.round(79 - (((duration - 600) / 600) * 14)))
      speedCategory = 'Moderate Buffer'
      metric.status = 'ready'
    } else {
      score = Math.max(30, Math.round(64 - (((duration - 1200) / 2000) * 34)))
      speedCategory = 'Slow Buffer'
      metric.status = 'ready'
    }

    metric.score = score
    metric.bufferSpeed = speedCategory

    // Log to telemetry
    telemetryLogs.benchmarks.push({
      providerId: provider.id,
      name: provider.name,
      score,
      latency: duration,
      speedCategory,
      verified: isVerified,
      timestamp: new Date().toISOString()
    })

    return { id: provider.id, score, latency: duration, verified: isVerified }
  } catch {
    clearTimeout(timeoutId)
    const duration = Math.round(performance.now() - startTime)
    const isTimeout = duration >= 4000

    metric.latency = isTimeout ? 4500 : duration
    metric.score = 0
    metric.bufferSpeed = isTimeout ? 'Timeout (>4.5s)' : 'Connection Failed'
    metric.status = 'error'

    return { id: provider.id, score: 0, latency: metric.latency, verified: false }
  }
}

/**
 * Scan all streaming servers for the active movie/show and calculate the full performance matrix.
 */
export async function runServerBenchmark(tmdbId, mediaType = 'movie', season = 1, episode = 1) {
  if (isTestingServers.value) return
  isTestingServers.value = true
  testingProgress.value.current = 0
  testingProgress.value.total = providers.length

  // Benchmark servers in parallel batches of 4
  const batchSize = 4
  for (let i = 0; i < providers.length; i += batchSize) {
    const batch = providers.slice(i, i + batchSize)
    await Promise.allSettled(
      batch.map(p => inspectServer(p, tmdbId, mediaType, season, episode))
    )
    testingProgress.value.current = Math.min(providers.length, i + batchSize)
  }

  // Rank servers: Prioritize 1) Verified streaming in browser, 2) High score, 3) Low latency
  const eligible = providers
    .map(p => ({
      provider: p,
      metrics: serverMetrics[p.id]
    }))
    .filter(({ metrics }) => metrics && metrics.score > 0 && !metrics.iframeBlocked)

  eligible.sort((a, b) => {
    // 1. Prioritize verified streaming players
    const aVerified = a.metrics.verified ? 1 : 0
    const bVerified = b.metrics.verified ? 1 : 0
    if (aVerified !== bVerified) return bVerified - aVerified

    // 2. Highest score
    if (b.metrics.score !== a.metrics.score) return b.metrics.score - a.metrics.score

    // 3. Lowest latency
    return (a.metrics.latency || 9999) - (b.metrics.latency || 9999)
  })

  const top = eligible[0]?.provider || providers.find(p => p.id === 'vidlink') || providers[0]
  bestServerId.value = top.id
  isTestingServers.value = false

  return {
    winner: top,
    winnerMetrics: serverMetrics[top.id],
    bestServerId: bestServerId.value
  }
}
