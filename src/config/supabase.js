import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@/utils/env.js'

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL')
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY')

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
)
