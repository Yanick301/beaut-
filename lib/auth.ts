import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Obtient l'utilisateur actuel depuis la session
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Obtient l'utilisateur et redirige si non connecté
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/connexion');
  }
  return user;
}

/**
 * Obtient le profil utilisateur
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}







