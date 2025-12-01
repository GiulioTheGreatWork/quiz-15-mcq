import { createClient } from '@supabase/supabase-js'

// --------------------
// Supabase configuration
// --------------------
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vcwueiiqcxrlezwnhpcx.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6b02hdwGoMVgjliddLJDsw_4yvNazoi'

// Check if Supabase is configured
const isSupabaseConfigured =
  SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''

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

// --------------------
// Save quiz attempt function
// --------------------
export async function saveQuizAttempt(email) {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({ email, attempted_at: new Date().toISOString() })
      .select('id, email, attempted_at') // optional, returns the inserted row

    if (error) {
      console.error('Error saving email to Supabase:', error)
      return { success: false, error }
    }

    console.log('Quiz attempt saved successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: err }
  }
}

// --------------------
// Example usage
// --------------------
/*
(async () => {
  const result = await saveQuizAttempt('user@example.com')
  console.log(result)
})()
*/
