<template>
  <header>
    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        (isScrolled || isPlatformPage)
          ? 'bg-[#0a0a0c]/98 backdrop-blur-xl py-3 shadow-[0_4px_25px_rgba(0,0,0,0.9)] border-b border-white/5'
          : 'bg-gradient-to-b from-black/95 via-black/50 to-transparent py-4'
      ]"
    >
      <div class="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <!-- Left: MYFLIX Logo (both mobile & desktop, matching user screenshot) -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center gap-2 group">
            <span class="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-wider text-white group-hover:text-white/95 transition-colors">
              MY<span class="text-[#E50914] group-hover:text-[#FF1E27] drop-shadow-[0_0_18px_rgba(229,9,20,0.6)]">FLIX</span>
            </span>
          </router-link>

          <!-- Desktop Nav Links -->
          <div class="hidden lg:flex items-center space-x-1">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-bone-400 hover:text-white transition-all duration-200"
              active-class="!text-white !font-bold bg-white/10 shadow-sm"
            >
              {{ link.name }}
            </router-link>

            <!-- Random Movie Suggestion Button Next to My List -->
            <button
              @click="openSuggestion"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#f5efe4] hover:text-white bg-white/5 hover:bg-[#E50914]/20 border border-white/10 hover:border-[#E50914]/50 transition-all duration-200 group ml-1 shadow-sm cursor-pointer"
              title="Get a random movie recommendation tailored to what you watch"
            >
              <span class="group-hover:rotate-180 transition-transform duration-500 text-sm">🎲</span>
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        <!-- Right Side: Search (desktop), User Pill, Hamburger Menu -->
        <div class="flex items-center space-x-2.5 sm:space-x-3">
          <!-- Desktop Search Pill -->
          <router-link
            to="/search"
            class="hidden sm:flex items-center gap-2.5 bg-surface-100/90 hover:bg-surface-200 text-bone-400 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#E50914]/60 transition-all text-xs shadow-sm font-sans w-48 md:w-60 justify-between group"
            title="Search movies, shows & anime (⌘K)"
          >
            <div class="flex items-center gap-2 truncate">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#E50914] group-hover:scale-110 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="truncate">Search titles, anime...</span>
            </div>
            <kbd class="font-mono text-[10px] bg-surface-200 border border-white/10 px-1.5 py-0.5 rounded text-bone-400 group-hover:text-white shrink-0">⌘K</kbd>
          </router-link>

          <!-- User Pill: [ (f) v ] (Screenshot: media_1792013008307_9691e574.png) -->
          <div v-if="user" class="relative">
            <button 
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center space-x-1 sm:space-x-2 text-xs bg-[#18181d]/85 hover:bg-[#25252b] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-white border border-white/10 hover:border-[#E50914]/50 transition-all shadow-sm cursor-pointer"
              :title="user.user_metadata?.full_name || profile?.username || user.email"
            >
              <img 
                v-if="user.user_metadata?.avatar_url" 
                :src="user.user_metadata.avatar_url" 
                alt="Avatar" 
                class="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
              />
              <div v-else class="w-5 h-5 rounded-full bg-[#387c3e] flex items-center justify-center font-bold text-[10px] text-white uppercase ring-1 ring-white/20">
                {{ (profile?.username || user.email || 'F')[0].toLowerCase() }}
              </div>
              <span class="max-w-[100px] truncate font-medium hidden sm:inline-block">
                {{ user.user_metadata?.full_name || profile?.username || user.email?.split('@')[0] }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-bone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <transition name="fade">
              <div 
                v-if="userMenuOpen" 
                class="absolute right-0 mt-2 w-52 bg-surface-100 rounded-xl shadow-2xl py-1.5 text-xs z-50 border border-white/10"
              >
                <div class="px-4 py-2 border-b border-white/5 text-bone-400">
                  Signed in as<br/><strong class="text-white truncate block mt-0.5">{{ user.email }}</strong>
                </div>
                <router-link 
                  to="/watchlist" 
                  @click="userMenuOpen = false" 
                  class="flex items-center gap-2 px-4 py-2.5 text-bone-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  My List
                </router-link>
                <button 
                  @click="handleSignOut" 
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-white/10 transition-colors border-t border-white/5 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </transition>
          </div>

          <router-link
            v-else
            to="/login"
            class="text-xs bg-[#E50914] hover:bg-[#FF1E27] text-white px-3.5 sm:px-4 py-1.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)]"
          >
            Sign In
          </router-link>

          <!-- Mobile Hamburger Menu Button: ≡ (Screenshot: media_1792013008307_9691e574.png) -->
          <button @click="toggleMenu" class="lg:hidden text-bone-300 hover:text-white p-1 rounded-lg focus:outline-none cursor-pointer">
            <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer Menu -->
      <transition name="fade">
        <div v-if="isMenuOpen" class="lg:hidden bg-surface-100/98 backdrop-blur-2xl border-t border-white/10 mt-3 mx-4 rounded-2xl overflow-hidden shadow-2xl">
          <div class="flex flex-col py-2">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-5 py-3 text-bone-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
              active-class="bg-[#E50914]/20 text-[#E50914] font-bold"
              @click="isMenuOpen = false"
            >
              {{ link.name }}
            </router-link>

            <button
              @click="isMenuOpen = false; openSuggestion()"
              class="flex items-center gap-2.5 px-5 py-3 text-[#E50914] hover:bg-white/10 transition-colors text-sm font-bold border-t border-white/5 text-left cursor-pointer"
            >
              <span>🎲</span>
              <span>Surprise Me (Random Movie)</span>
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Netflix iOS Floating Capsule Navigation Dock (Home, Clips, Search, My Netflix) -->
    <div class="lg:hidden fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[340px] bg-[#141418]/92 backdrop-blur-2xl border border-white/12 rounded-full py-2 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.9)] flex items-center justify-between">
      <!-- 1. Home -->
      <router-link
        to="/"
        class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all text-[10px]"
        :class="route.path === '/' ? 'bg-white/15 text-white font-bold' : 'text-bone-400 hover:text-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </router-link>

      <!-- 2. Clips (Triggers Surprise Me Recommendation) -->
      <button
        @click="openSuggestion"
        class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all text-[10px] text-bone-400 hover:text-white cursor-pointer active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="5" width="14" height="15" rx="3" stroke-width="1.8"/>
          <path d="M7 2.5h10a3 3 0 0 1 3 3V16" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M8.5 10l5 3-5 3v-6z" fill="currentColor"/>
        </svg>
        <span>Clips</span>
      </button>

      <!-- 3. Search -->
      <router-link
        to="/search"
        class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all text-[10px]"
        :class="route.path === '/search' ? 'bg-white/15 text-white font-bold' : 'text-bone-400 hover:text-white'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
      </router-link>

      <!-- 4. My Netflix (Classic Blue Smiley Profile) -->
      <router-link
        to="/watchlist"
        class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all text-[10px]"
        :class="route.path === '/watchlist' ? 'bg-white/15 text-white font-bold' : 'text-bone-400 hover:text-white'"
      >
        <!-- Netflix Blue Smiley Avatar -->
        <div class="w-5 h-5 rounded-md bg-[#0071eb] flex flex-col items-center justify-center p-0.5 shadow-sm">
          <div class="flex items-center gap-1 mt-0.5">
            <span class="w-1 h-1 bg-white rounded-full"></span>
            <span class="w-1 h-1 bg-white rounded-full"></span>
          </div>
          <svg viewBox="0 0 16 8" class="w-2.5 h-1.5 text-white fill-none stroke-current" stroke-width="2" stroke-linecap="round">
            <path d="M2 2c2 3 8 3 12 0" />
          </svg>
        </div>
        <span>My Netflix</span>
      </router-link>
    </div>

    <!-- Quick Toast Notification for Cast / Download / Bell -->
    <transition name="fade">
      <div 
        v-if="toastMessage" 
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[120] bg-[#141418]/95 backdrop-blur-xl border border-white/20 text-white text-xs px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2 pointer-events-none"
      >
        <span class="w-2 h-2 rounded-full bg-[#E50914] animate-ping"></span>
        <span class="font-medium">{{ toastMessage }}</span>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useRecommendation } from '@/composables/useRecommendation.js'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const userMenuOpen = ref(false)
const router = useRouter()
const route = useRoute()
const { user, profile, signOut } = useAuth()
const { openSuggestion } = useRecommendation()

const toastMessage = ref('')
let toastTimer = null
const showFeatureToast = (msg) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

const currentMobileTitle = computed(() => {
  if (route.path === '/') return 'Home'
  if (route.path === '/tv') return 'Shows'
  if (route.path === '/movies') return 'Movies'
  if (route.path === '/anime') return 'Anime'
  if (route.path === '/search') return 'Search'
  if (route.path === '/watchlist') return 'My Netflix'
  if (route.path.startsWith('/platforms')) return 'Platforms'
  return 'Home'
})

const showMobileFilterPills = computed(() => {
  return ['/', '/tv', '/movies', '/anime'].includes(route.path)
})

const isPlatformPage = computed(() => route.path.startsWith('/platforms'))

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'Shows', path: '/tv' },
  { name: 'Anime', path: '/anime' },
  { name: 'My List', path: '/watchlist' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleSignOut = async () => {
  userMenuOpen.value = false
  await signOut()
  router.push('/')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    router.push('/search')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
