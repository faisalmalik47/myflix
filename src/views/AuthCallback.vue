<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white px-4">
    <div class="text-center max-w-sm p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
      <div v-if="error" class="space-y-4">
        <div class="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
          &times;
        </div>
        <h2 class="text-lg font-bold text-white">Authentication Failed</h2>
        <p class="text-xs text-white/60">{{ error }}</p>
        <router-link
          to="/login"
          class="inline-block px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-semibold hover:brightness-110 transition-all"
        >
          Back to Login
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div class="w-12 h-12 rounded-full border-2 border-[#E50914] border-t-transparent animate-spin mx-auto"></div>
        <h2 class="text-lg font-bold text-white">Completing Sign-In</h2>
        <p class="text-xs text-white/60">Connecting with your Google Account…</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase.js'

const router = useRouter()
const error = ref('')

onMounted(async () => {
  try {
    // 1. Process hash or query params from OAuth redirect
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      error.value = sessionError.message
      return
    }

    if (session) {
      // Successfully authenticated
      setTimeout(() => {
        router.push('/')
      }, 600)
    } else {
      // Listen to auth state change in case hash is still processing
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (newSession) {
          subscription.unsubscribe()
          router.push('/')
        }
      })

      // Timeout fallback
      setTimeout(() => {
        if (!error.value) {
          router.push('/')
        }
      }, 2500)
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred during sign-in.'
  }
})
</script>
