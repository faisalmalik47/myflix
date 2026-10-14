<template>
  <div class="min-h-screen bg-surface">
    <Navbar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <RandomMovieSuggestionModal />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import RandomMovieSuggestionModal from '@/components/RandomMovieSuggestionModal.vue'
</script>
