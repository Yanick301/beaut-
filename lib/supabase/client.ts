import { createBrowserClient } from '@supabase/ssr'

// Vérifier que les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL\n' +
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
