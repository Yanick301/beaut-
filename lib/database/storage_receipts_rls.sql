-- Script SQL pour configurer les politiques RLS du bucket Storage "receipts"
-- À exécuter dans l'éditeur SQL de Supabase

-- IMPORTANT : Assurez-vous que le bucket "receipts" existe dans Storage
-- et qu'il est configuré comme PRIVATE (pas public)

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all receipts" ON storage.objects;

-- Politique pour permettre aux utilisateurs d'uploader des reçus pour leurs propres commandes
-- Le nom du fichier est au format: receipts/ORDER_ID-timestamp.ext
-- On vérifie que l'ORDER_ID appartient à l'utilisateur connecté
CREATE POLICY "Users can upload their own receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  (
    -- Extraire l'order_id du nom de fichier (première partie avant le premier tiret)
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (string_to_array((storage.foldername(name))[2], '-'))[1]
      AND orders.user_id = auth.uid()
    )
  )
);

-- Politique pour permettre aux utilisateurs de voir leurs propres reçus
CREATE POLICY "Users can view their own receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  (
    -- Vérifier que le fichier appartient à une commande de l'utilisateur
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (string_to_array((storage.foldername(name))[2], '-'))[1]
      AND orders.user_id = auth.uid()
    )
    OR
    -- Ou si le nom contient directement l'order_id
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE name LIKE '%' || orders.id::text || '%'
      AND orders.user_id = auth.uid()
    )
  )
);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres reçus
CREATE POLICY "Users can update their own receipts"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id::text = (string_to_array((storage.foldername(name))[2], '-'))[1]
    AND orders.user_id = auth.uid()
  )
);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres reçus
CREATE POLICY "Users can delete their own receipts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id::text = (string_to_array((storage.foldername(name))[2], '-'))[1]
    AND orders.user_id = auth.uid()
  )
);

-- Politique pour permettre aux admins de voir tous les reçus
CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Politique pour permettre aux admins de gérer tous les reçus
CREATE POLICY "Admins can manage all receipts"
ON storage.objects FOR ALL
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);






