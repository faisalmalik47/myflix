<template>
  <header>
    <!-- Top Sticky Navbar -->
    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isScrolled ? 'bg-[#0a0a0c]/95 backdrop-blur-md py-3 shadow-[0_4px_25px_rgba(0,0,0,0.8)] border-b border-white/5' : 'bg-gradient-to-b from-black/95 via-black/50 to-transparent py-4'
      ]"
    >
      <div class="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <!-- Left: Logo & Desktop Links -->
        <div class="flex items-center space-x-8">
          <!-- MYFLIX Brand Logo -->
          <router-link to="/" class="flex items-center gap-2 group">
            <span class="text-3xl md:text-4xl font-display font-black tracking-wider text-white group-hover:text-white/95 transition-colors">
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
          </div>
        </div>

        <!-- Right: Search & Actions -->
        <div class="flex items-center space-x-3">
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

          <!-- Compact Search Icon for Mobile -->
          <router-link
            to="/search"
            class="sm:hidden text-bone-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </router-link>

          <!-- User / Auth Menu -->
          <div v-if="user" class="relative">
            <button 
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center space-x-2 text-xs bg-surface-100 px-3 py-1.5 rounded-full text-white border border-white/10 hover:border-[#E50914]/50 transition-all shadow-sm"
            >
              <img 
                v-if="user.user_metadata?.avatar_url" 
                :src="user.user_metadata.avatar_url" 
                alt="Avatar" 
                class="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
              />
              <span v-else class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="max-w-[110px] truncate font-medium">
                {{ user.user_metadata?.full_name || profile?.username || user.email?.split('@')[0] }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-bone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <transition name="fade">
              <div 
                v-if="userMenuOpen" 
                class="absolute right-0 mt-2 w-52 bg-surface-100 rounded-xl shadow-2xl py-1.5 text-xs z-50 border border-white/10"
              >
                <div class="px-4 py-2 border-b border-white/5 text-bone-400">
                  Signed in as<br/><strong class="text-white truncate block mt-0.5">{{ user.email }}</strong>
                </div>
                <router-link 
                  to="/my-list" 
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
                  class="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-white/10 transition-colors border-t border-white/5"
                >
                  Sign Out
                </button>
              </div>
            </transition>
          </div>

          <router-link
            v-else
            to="/login"
            class="text-xs bg-[#E50914] hover:bg-[#FF1E27] text-white px-4 py-1.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)]"
          >
            Sign In
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button @click="toggleMenu" class="lg:hidden text-bone-300 hover:text-white p-1 rounded-lg focus:outline-none">
            <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition name="fade">
        <div v-if="isMenuOpen" class="lg:hidden bg-surface-100 border-t border-white/10 mt-3 mx-4 rounded-2xl overflow-hidden shadow-2xl">
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
          </div>
        </div>
      </transition>
    </nav>

    <!-- Mobile Bottom Navigation Bar (Redflix App Bar) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/10 px-6 py-2.5 flex items-center justify-around shadow-2xl">
      <router-link
        to="/"
        class="flex flex-col items-center gap-1 text-[11px] text-bone-400 hover:text-white transition-colors"
        active-class="!text-[#E50914] font-bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </router-link>

      <router-link
        to="/search"
        class="flex flex-col items-center gap-1 text-[11px] text-bone-400 hover:text-white transition-colors"
        active-class="!text-[#E50914] font-bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
      </router-link>

      <router-link
        to="/anime"
        class="flex flex-col items-center gap-1 text-[11px] text-bone-400 hover:text-white transition-colors"
        active-class="!text-[#E50914] font-bold"
      >
        <span class="text-base leading-none">⛩️</span>
        <span>Anime</span>
      </router-link>

      <router-link
        to="/my-list"
        class="flex flex-col items-center gap-1 text-[11px] text-bone-400 hover:text-white transition-colors"
        active-class="!text-[#E50914] font-bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>My List</span>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const userMenuOpen = ref(false)
const router = useRouter()
const { user, profile, signOut } = useAuth()

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
