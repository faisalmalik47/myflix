import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@/utils/env.js'

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || 'https://cnnsouwudpcukmzxftcc.supabase.co'
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || ''

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'placeholder-key-for-init'
)
