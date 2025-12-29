-- Script SQL pour ajouter les politiques RLS permettant aux admins de voir toutes les commandes
-- À exécuter dans l'éditeur SQL de Supabase

-- ============================================
-- POLITIQUES POUR LES ADMINS
-- ============================================

-- 1. Permettre aux admins de voir tous les profils
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.is_admin = true
    )
    OR
    -- Vérifier aussi via ADMIN_EMAILS (nécessite une fonction helper)
    auth.uid() = id
  );

-- 2. Permettre aux admins de voir toutes les commandes
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    -- Les utilisateurs peuvent voir leurs propres commandes
    auth.uid() = user_id
    OR
    -- Les admins peuvent voir toutes les commandes
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 3. Permettre aux admins de voir tous les order_items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    -- Les utilisateurs peuvent voir leurs propres order_items
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    OR
    -- Les admins peuvent voir tous les order_items
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 4. Permettre aux admins de mettre à jour toutes les commandes
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 5. Permettre aux admins de voir tous les favoris (optionnel, pour statistiques)
CREATE POLICY "Admins can view all favorites"
  ON public.favorites FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 6. Permettre aux admins de voir toutes les adresses de livraison (optionnel)
CREATE POLICY "Admins can view all shipping addresses"
  ON public.shipping_addresses FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );









