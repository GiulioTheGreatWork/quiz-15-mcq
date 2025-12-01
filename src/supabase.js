import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Use environment variables if available, otherwise use hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vcwueiiqcxrlezwnhpcx.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6b02hdwGoMVgjliddLJDsw_4yvNazoi'

// Check if Supabase is configured
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''

// Log configuration status (always log in production too for debugging)
console.log('Supabase Configuration:', {
  isConfigured: isSupabaseConfigured,
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
  url: SUPABASE_URL ? SUPABASE_URL.substring(0, 30) + '...' : 'Missing'
})

// Create Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured

