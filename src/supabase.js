import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Use environment variables if available, otherwise use hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vcwueiiqcxrlezwnhpcx.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3VlaWlxY3hybGV6d25ocGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjQyODMsImV4cCI6MjA4MDE0MDI4M30.PQBm7FV182dQyYEOZiXErc8sR6-KFWEuVvez7cURUUc'

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

