# 🔐 Guide : Nommer un utilisateur Admin et accéder au Dashboard

## 📋 Vue d'ensemble

Il existe **deux méthodes** pour donner les droits administrateur à un utilisateur. Vous pouvez utiliser l'une ou l'autre, ou les deux ensemble.

---

## 🎯 Méthode 1 : Via les variables d'environnement (RECOMMANDÉ pour commencer)

### Avantages
- ✅ Rapide et simple
- ✅ Pas besoin de modifier la base de données
- ✅ Fonctionne immédiatement après redémarrage

### Étapes

1. **Ouvrez votre fichier `.env.local`** à la racine du projet

2. **Ajoutez ou modifiez la variable `ADMIN_EMAILS`** :

```env
# Un seul admin
ADMIN_EMAILS=admin@essencefeminine.nl

# Plusieurs admins (séparés par des virgules)
ADMIN_EMAILS=admin@essencefeminine.nl,admin2@essencefeminine.nl,manager@essencefeminine.nl
```

3. **Redémarrez votre serveur de développement** :
```bash
npm run dev
```

4. **C'est tout !** L'utilisateur avec cet email aura automatiquement accès au dashboard admin.

### ⚠️ Important
- L'email doit correspondre **exactement** à l'email utilisé lors de l'inscription
- Les emails sont comparés en minuscules (case-insensitive)
- Pour la production, ajoutez cette variable dans les variables d'environnement de Vercel

---

## 🎯 Méthode 2 : Via la base de données Supabase

### Avantages
- ✅ Plus permanent (ne dépend pas des variables d'environnement)
- ✅ Peut être géré directement depuis Supabase
- ✅ Fonctionne même si les variables d'environnement changent

### Prérequis

1. **Exécuter le script SQL** pour ajouter la colonne `is_admin` :

Allez dans **Supabase Dashboard** > **SQL Editor** et exécutez :

```sql
-- Ajouter la colonne is_admin si elle n'existe pas
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
```

### Étapes pour nommer un utilisateur admin

1. **Connectez-vous à Supabase Dashboard**
   - Allez sur [supabase.com](https://supabase.com)
   - Sélectionnez votre projet

2. **Trouvez l'ID de l'utilisateur** :

   **Option A : Via l'éditeur SQL**
   ```sql
   -- Voir tous les utilisateurs avec leurs emails
   SELECT id, email FROM auth.users;
   ```

   **Option B : Via l'interface**
   - Allez dans **Authentication** > **Users**
   - Trouvez l'utilisateur et notez son **UUID** (ID)

3. **Marquer l'utilisateur comme admin** :

   **Option A : Par email (plus simple)**
   ```sql
   -- Remplacer 'admin@essencefeminine.nl' par l'email de l'admin
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@essencefeminine.nl');
   ```

   **Option B : Par ID utilisateur**
   ```sql
   -- Remplacer 'USER_UUID_HERE' par l'UUID de l'utilisateur
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE id = 'USER_UUID_HERE';
   ```

4. **Vérifier que ça a fonctionné** :
   ```sql
   -- Voir tous les admins
   SELECT p.id, u.email, p.is_admin 
   FROM public.profiles p
   JOIN auth.users u ON p.id = u.id
   WHERE p.is_admin = true;
   ```

---

## 🚀 Accéder au Dashboard Admin

### URL du Dashboard

- **Développement local** : `http://localhost:3000/admin`
- **Production** : `https://votre-domaine.com/admin`

### Étapes d'accès

1. **Connectez-vous** avec le compte admin :
   - Allez sur `/connexion`
   - Entrez l'email et le mot de passe de l'utilisateur admin

2. **Accédez au dashboard** :
   - Allez directement sur `/admin`
   - OU cliquez sur un lien vers `/admin` depuis votre site

3. **Si vous n'êtes pas connecté** :
   - Vous serez automatiquement redirigé vers `/connexion`
   - Après connexion, vous serez redirigé vers `/admin`

4. **Si vous n'avez pas les droits admin** :
   - Vous verrez un message d'erreur : "Accès refusé. Droits administrateur requis."
   - Vous serez redirigé vers la page d'accueil

---

## ✅ Vérifier que l'accès admin fonctionne

### Test rapide

1. **Connectez-vous** avec le compte admin
2. **Allez sur** `/admin`
3. **Vous devriez voir** :
   - Le titre "Dashboard Admin"
   - Les statistiques des commandes
   - La liste des commandes

### Si ça ne fonctionne pas

1. **Vérifiez que l'utilisateur existe** :
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'votre-email@example.com';
   ```

2. **Vérifiez la méthode utilisée** :
   - Si vous utilisez **Méthode 1** : Vérifiez que `ADMIN_EMAILS` est bien dans `.env.local` et que le serveur a été redémarré
   - Si vous utilisez **Méthode 2** : Vérifiez que `is_admin = true` dans la table `profiles`

3. **Vérifiez le profil** :
   ```sql
   SELECT p.*, u.email 
   FROM public.profiles p
   JOIN auth.users u ON p.id = u.id
   WHERE u.email = 'votre-email@example.com';
   ```

4. **Vérifiez les logs** :
   - Ouvrez la console du navigateur (F12)
   - Regardez les erreurs éventuelles

---

## 🔄 Retirer les droits admin

### Méthode 1 (Variables d'environnement)
- Retirez l'email de `ADMIN_EMAILS` dans `.env.local`
- Redémarrez le serveur

### Méthode 2 (Base de données)
```sql
-- Retirer les droits admin d'un utilisateur
UPDATE public.profiles 
SET is_admin = false 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@essencefeminine.nl');
```

---

## 📝 Exemple complet

### Scénario : Nommer "jean.dupont@essencefeminine.nl" comme admin

**Méthode 1 (Rapide)** :
1. Ajoutez dans `.env.local` :
   ```env
   ADMIN_EMAILS=jean.dupont@essencefeminine.nl
   ```
2. Redémarrez : `npm run dev`
3. Connectez-vous avec cet email
4. Allez sur `/admin`

**Méthode 2 (Permanent)** :
1. Exécutez dans Supabase SQL Editor :
   ```sql
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'jean.dupont@essencefeminine.nl');
   ```
2. Connectez-vous avec cet email
3. Allez sur `/admin`

---

## 🔒 Sécurité

- ⚠️ **Ne partagez jamais** votre fichier `.env.local` (il est dans `.gitignore`)
- ⚠️ **Protégez** vos variables d'environnement en production (Vercel, etc.)
- ⚠️ **Limitez** le nombre d'admins au strict nécessaire
- ⚠️ **Utilisez des mots de passe forts** pour les comptes admin

---

## 🆘 Dépannage

### "Accès refusé" même après configuration

1. **Vérifiez que vous êtes bien connecté** :
   - Allez sur `/compte` - si vous êtes redirigé vers `/connexion`, vous n'êtes pas connecté

2. **Vérifiez l'email** :
   - L'email doit correspondre exactement (sauf la casse)
   - Vérifiez qu'il n'y a pas d'espaces avant/après dans `ADMIN_EMAILS`

3. **Vérifiez la base de données** :
   ```sql
   -- Voir si is_admin est bien à true
   SELECT p.is_admin, u.email 
   FROM public.profiles p
   JOIN auth.users u ON p.id = u.id
   WHERE u.email = 'votre-email@example.com';
   ```

4. **Videz le cache** :
   - Déconnectez-vous et reconnectez-vous
   - Videz les cookies du navigateur

---

## 📚 Ressources

- Fichier de configuration : `ADMIN_SETUP.md`
- Script SQL : `lib/database/admin_update.sql`
- Code de vérification : `app/api/admin/orders/route.ts` (fonction `isAdmin`)

---

**Besoin d'aide ?** Vérifiez les logs de la console et les erreurs dans Supabase Dashboard.













