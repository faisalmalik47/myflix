<template>
  <div class="min-h-screen bg-[#0a0a0c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 text-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <router-link to="/" class="inline-flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#B81D24] flex items-center justify-center font-display font-black text-white text-xl shadow-[0_0_20px_rgba(229,9,20,0.5)]">
          MF
        </div>
        <span class="text-3xl font-display font-black tracking-wider text-white">
          MY<span class="text-[#E50914]">FLIX</span>
        </span>
      </router-link>
      <h2 class="mt-4 text-2xl font-bold text-white tracking-tight font-display">
        {{ isSignUp ? 'Create your MyFlix account' : 'Welcome back to MyFlix' }}
      </h2>
      <p class="mt-1.5 text-xs text-bone-400">
        Sync your watchlist, progress, and preferences across devices
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-[#121216] py-8 px-6 shadow-2xl rounded-2xl border border-white/10 sm:px-10 backdrop-blur-xl">
        
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-5 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center gap-2.5">
          <span class="text-rose-400 text-base leading-none">&times;</span>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-5 p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2.5">
          <span class="text-emerald-400 text-base leading-none">&check;</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Google OAuth Sign-In Button (Cinextma / Supabase integration) -->
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span class="bg-[#121216] px-3 text-bone-400">Or continue with email</span>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div v-if="isSignUp">
            <label for="username" class="block text-xs font-medium text-bone-300">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                class="appearance-none block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/20 text-white focus:outline-none focus:border-[#E50914] text-xs transition-colors"
                placeholder="faisal"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-xs font-medium text-bone-300">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/20 text-white focus:outline-none focus:border-[#E50914] text-xs transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-xs font-medium text-bone-300">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/20 text-white focus:outline-none focus:border-[#E50914] text-xs transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E50914] to-[#B81D24] hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(229,9,20,0.35)] disabled:opacity-50 transition-all cursor-pointer"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSignUp ? 'Create MyFlix Account' : 'Sign In' }}
            </button>
          </div>
        </form>

        <div class="mt-6 flex items-center justify-between text-xs text-bone-400">
          <button 
            type="button" 
            @click="toggleMode"
            class="hover:text-white underline transition-colors cursor-pointer"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
          <router-link to="/" class="hover:text-white transition-colors">
            Skip to Home &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const { signIn, signUp, signInWithGoogle } = useAuth()

const isSignUp = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  successMessage.value = ''
}

const handleGoogleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await signInWithGoogle()
  } catch (err) {
    errorMessage.value = err.message || 'Failed to connect with Google.'
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isSignUp.value) {
      await signUp(email.value, password.value, username.value)
      successMessage.value = 'Account created successfully! Check your email to confirm if required, or sign in.'
    } else {
      await signIn(email.value, password.value)
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred during authentication.'
  } finally {
    loading.value = false
  }
}
</script>
