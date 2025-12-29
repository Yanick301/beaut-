# 🔧 Dépannage : Erreur "Erreur lors de la récupération des commandes"

## 🔴 Problème

Vous voyez le message "Erreur lors de la récupération des commandes" dans le dashboard admin.

## 🔍 Causes possibles

### 1. Politiques RLS (Row Level Security) manquantes (LE PLUS PROBABLE)

**Symptôme** : Erreur `PGRST301` ou "permission denied" dans les logs

**Cause** : Les politiques RLS de Supabase empêchent les admins de voir toutes les commandes. Par défaut, les utilisateurs ne peuvent voir que leurs propres commandes.

**Solution** : Exécutez le script SQL suivant dans Supabase :

1. Allez dans **Supabase Dashboard** > **SQL Editor**
2. Exécutez le contenu du fichier `lib/database/admin_rls_policies.sql`

Ou copiez-collez ce script :

```sql
-- Permettre aux admins de voir toutes les commandes
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

-- Permettre aux admins de voir tous les order_items
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

-- Permettre aux admins de mettre à jour toutes les commandes
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
```

### 2. L'utilisateur n'est pas vraiment admin

**Vérification** :

1. **Vérifiez dans la base de données** :
```sql
-- Voir si l'utilisateur est admin
SELECT p.id, u.email, p.is_admin 
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'votre-email@example.com';
```

2. **Vérifiez les variables d'environnement** :
   - Ouvrez `.env.local`
   - Vérifiez que `ADMIN_EMAILS` contient votre email
   - Redémarrez le serveur

### 3. La colonne `is_admin` n'existe pas

**Solution** : Exécutez ce script dans Supabase :

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
```

### 4. Problème de connexion à Supabase

**Vérification** :
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Vérifiez que Supabase est accessible

## 🔧 Solution complète étape par étape

### Étape 1 : Vérifier que vous êtes admin

```sql
-- Dans Supabase SQL Editor
SELECT 
  u.email,
  p.is_admin,
  CASE 
    WHEN p.is_admin = true THEN '✅ Admin (via is_admin)'
    ELSE '❌ Pas admin (via is_admin)'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'votre-email@example.com';
```

### Étape 2 : Créer la colonne is_admin si nécessaire

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
```

### Étape 3 : Marquer l'utilisateur comme admin

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'votre-email@example.com');
```

### Étape 4 : Créer les politiques RLS pour les admins

Exécutez le script complet dans `lib/database/admin_rls_policies.sql` ou copiez :

```sql
-- Supprimer les anciennes politiques si elles existent (optionnel)
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Créer les nouvelles politiques
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
```

### Étape 5 : Vérifier que les politiques sont créées

```sql
-- Voir toutes les politiques sur orders
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Étape 6 : Tester

1. Déconnectez-vous et reconnectez-vous
2. Allez sur `/admin`
3. Les commandes devraient maintenant s'afficher

## 🐛 Debug avancé

### Voir les erreurs détaillées

1. Ouvrez la **console du navigateur** (F12)
2. Allez dans l'onglet **Console**
3. Rechargez la page `/admin`
4. Regardez les erreurs affichées

### Vérifier les logs Supabase

1. Allez dans **Supabase Dashboard** > **Logs** > **Postgres Logs**
2. Regardez les erreurs récentes

### Tester la requête directement

Dans Supabase SQL Editor, testez cette requête (remplacez `YOUR_USER_ID` par votre UUID) :

```sql
-- Tester si vous pouvez voir toutes les commandes
SELECT 
  o.*,
  p.is_admin as user_is_admin
FROM public.orders o
LEFT JOIN public.profiles p ON p.id = auth.uid()
WHERE 
  o.user_id = auth.uid()  -- Vos propres commandes
  OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true;  -- Ou si vous êtes admin
```

## ✅ Checklist de vérification

- [ ] La colonne `is_admin` existe dans `profiles`
- [ ] L'utilisateur a `is_admin = true` dans `profiles`
- [ ] OU l'email est dans `ADMIN_EMAILS` dans `.env.local`
- [ ] Les politiques RLS pour les admins sont créées
- [ ] Vous êtes bien connecté (vérifiez `/compte`)
- [ ] Les variables d'environnement Supabase sont correctes
- [ ] Le serveur a été redémarré après modification de `.env.local`

## 📞 Si le problème persiste

1. Vérifiez les logs de la console du navigateur
2. Vérifiez les logs Supabase
3. Vérifiez que toutes les politiques RLS sont bien créées
4. Essayez de vous déconnecter et reconnecter
5. Videz le cache du navigateur





