<template>
  <footer class="bg-surface-50 border-t border-white/8 py-10 pb-24 lg:pb-10 mt-auto text-xs text-bone-400">
    <div class="container mx-auto px-4 md:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        
        <!-- Brand -->
        <div class="flex flex-col items-center md:items-start">
          <router-link to="/" class="flex items-center gap-2 mb-2 group">
            <span class="text-2xl font-display font-black tracking-wider text-white group-hover:text-white/95 transition-colors">
              MY<span class="text-[#E50914] group-hover:text-[#FF1E27] drop-shadow-[0_0_12px_rgba(229,9,20,0.6)]">FLIX</span>
            </span>
          </router-link>
          <p class="text-bone-400 text-xs text-center md:text-left max-w-md">
            Stream the latest movies, TV shows & anime in HD. Cloud sync powered by Supabase. Hollywood, Bollywood & international — watch instantly.
          </p>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap justify-center gap-4 md:gap-6 font-medium text-bone-300">
          <router-link to="/" class="hover:text-white transition-colors">Home</router-link>
          <router-link to="/movies" class="hover:text-white transition-colors">Movies</router-link>
          <router-link to="/tv-shows" class="hover:text-white transition-colors">Shows</router-link>
          <router-link to="/anime" class="hover:text-white transition-colors">Anime</router-link>
          <router-link to="/my-list" class="hover:text-white transition-colors">My List</router-link>
          <router-link to="/search" class="hover:text-white transition-colors">Search</router-link>
        </div>
        
      </div>
      
      <div class="border-t border-white/8 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p class="text-bone-400 font-mono text-[11px]">
          &copy; {{ currentYear }} MyFlix. Free streaming discovery — not affiliated with any studio or platform.
        </p>
        <p class="text-bone-400 text-[11px] text-center md:text-right">
          Disclaimer: This service does not host any media files. All streams are embedded from non-affiliated third-party mirrors.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
