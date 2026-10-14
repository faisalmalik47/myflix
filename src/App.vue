<template>
  <div class="min-h-screen bg-surface">
    <Navbar v-if="!isWatchPage" />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isWatchPage" />
    <RandomMovieSuggestionModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import RandomMovieSuggestionModal from '@/components/RandomMovieSuggestionModal.vue'

const route = useRoute()
const isWatchPage = computed(() => {
  return route.name === 'StreamMovie' || 
         route.name === 'StreamTv' || 
         route.name === 'Play' ||
         Boolean(route.path && route.path.includes('/watch'))
})
</script>
