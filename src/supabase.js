import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Replace these with your actual Supabase project URL and anon key
// For GitHub Pages, you can also hardcode these values here temporarily
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vcwueiiqcxrlezwnhpcx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3VlaWlxY3hybGV6d25ocGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjQyODMsImV4cCI6MjA4MDE0MDI4M30.PQBm7FV182dQyYEOZiXErc8sR6-KFWEuVvez7cURUUc'

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''

// Log configuration status (always log in production too for debugging)
console.log('Supabase Configuration:', {
  isConfigured: isSupabaseConfigured,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Missing'
})

// Create Supabase client only if configured, otherwise create a mock client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured

