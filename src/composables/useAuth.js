import { ref, readonly } from 'vue'
import { supabase } from '@/config/supabase.js'

const user = ref(null)
const profile = ref(null)
const session = ref(null)
const loading = ref(true)

async function loadProfile(userId) {
  if (!userId) {
    profile.value = null
    return
  }
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      profile.value = data
    }
  } catch {
    // If profiles table is empty or profile not yet created
    profile.value = null
  }
}

// Initialize: listen for auth state changes
supabase.auth.onAuthStateChange(async (event, newSession) => {
  session.value = newSession
  user.value = newSession?.user ?? null
  if (user.value) {
    await loadProfile(user.value.id)
  } else {
    profile.value = null
  }
  loading.value = false
})

// Also check initial session
supabase.auth.getSession().then(async ({ data }) => {
  session.value = data.session
  user.value = data.session?.user ?? null
  if (user.value) {
    await loadProfile(user.value.id)
  }
  loading.value = false
})

export function useAuth() {
  async function signInWithGoogle() {
    const isFlixSubpath = window.location.pathname.startsWith('/flix')
    const redirectUrl = `${window.location.origin}${isFlixSubpath ? '/flix' : ''}/auth/callback`
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signUp(email, password, username = '') {
    const isFlixSubpath = window.location.pathname.startsWith('/flix')
    const redirectUrl = `${window.location.origin}${isFlixSubpath ? '/flix' : ''}/auth/callback`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username || email.split('@')[0]
        }
      },
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    profile.value = null
    session.value = null
  }

  async function resetPassword(email) {
    const isFlixSubpath = window.location.pathname.startsWith('/flix')
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${isFlixSubpath ? '/flix' : ''}/reset-password`,
    })
    if (error) throw error
    return data
  }

  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
  }

  const isAuthenticated = () => !!user.value

  return {
    user: readonly(user),
    profile: readonly(profile),
    session: readonly(session),
    loading: readonly(loading),
    signInWithGoogle,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated,
  }
}
