import { createClient } from '@supabase/supabase-js'

/**
 * Crée un client Supabase avec les privilèges admin (service role)
 * Ce client contourne RLS et peut accéder à toutes les données
 * ⚠️ À utiliser UNIQUEMENT dans les API routes admin
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. This is required for admin operations.')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

