-- Script SQL pour ajouter les champs de reçu de virement à la table orders
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour le reçu de virement
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS receipt_file_name TEXT;

-- Créer un bucket Supabase Storage pour les reçus (à faire manuellement dans Supabase Dashboard)
-- Storage > Create bucket > Nom: "receipts" > Public: false

-- Politique RLS pour permettre aux admins de voir tous les reçus
-- (Les utilisateurs peuvent déjà voir leurs propres commandes via la politique existante)


