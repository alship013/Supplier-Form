import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// For demo purposes, we'll use localStorage as a fallback
export const useLocalStorageFallback = () => {
  // This will be used when Supabase is not properly configured
  return {
    isConnected: false,
    message: 'Using local storage for demo purposes'
  }
}

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('visitors').select('count').single()
    if (error) {
      console.warn('Supabase not connected, using localStorage fallback')
      return false
    }
    return true
  } catch (err) {
    console.warn('Supabase not available, using localStorage fallback')
    return false
  }
}