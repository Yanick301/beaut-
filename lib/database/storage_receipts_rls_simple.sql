-- Script SQL SIMPLIFIÉ pour configurer les politiques RLS du bucket Storage "receipts"
-- Version simplifiée qui fonctionne avec le format de nom de fichier utilisé
-- À exécuter dans l'éditeur SQL de Supabase

-- IMPORTANT : Assurez-vous que le bucket "receipts" existe dans Storage
-- et qu'il est configuré comme PRIVATE (pas public)

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;

-- Politique SIMPLIFIÉE : Permettre à tous les utilisateurs authentifiés d'uploader dans receipts
-- (Le contrôle d'accès se fait au niveau de l'application via la vérification de l'orderId)
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.role() = 'authenticated'
);

-- Politique : Permettre aux utilisateurs de voir les fichiers qui contiennent leur order_id
-- Le nom du fichier contient l'order_id, on vérifie que l'order appartient à l'utilisateur
CREATE POLICY "Users can view their receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  (
    -- Vérifier si le nom du fichier contient un order_id qui appartient à l'utilisateur
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE name LIKE '%' || orders.id::text || '%'
      AND orders.user_id = auth.uid()
    )
  )
);

-- Politique : Permettre aux admins de voir tous les reçus
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






