-- Script SQL pour ajouter le support admin dans la table profiles
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne is_admin si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Optionnel : Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Optionnel : Marquer un utilisateur comme admin (remplacer 'user-email@example.com' par l'email de l'admin)
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');









