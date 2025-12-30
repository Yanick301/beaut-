# 🔧 Correction : Affichage des commandes dans le dashboard admin

## Problème résolu

Les commandes ne s'affichaient pas dans le dashboard admin à cause des politiques RLS (Row Level Security) de Supabase qui bloquaient l'accès même pour les admins.

## Solution implémentée

Un client Supabase admin a été créé qui utilise la **service role key** pour contourner RLS et voir toutes les commandes.

## Configuration requise

### 1. Ajouter la clé service role dans les variables d'environnement

Dans votre fichier `.env.local` (développement) et dans les variables d'environnement Vercel (production), ajoutez :

```env
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-supabase
```

### 2. Comment obtenir la service role key

1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez la **service_role key** (⚠️ gardez-la secrète !)
5. Ajoutez-la dans `.env.local` et dans Vercel

### 3. Redémarrer le serveur

```bash
npm run dev
```

## Modifications apportées

1. **Nouveau fichier** : `lib/supabase/admin.ts`
   - Crée un client Supabase avec les privilèges admin
   - Contourne RLS pour voir toutes les données

2. **API admin mise à jour** :
   - `/api/admin/orders` - Utilise maintenant le client admin
   - `/api/admin/orders/[orderId]/confirm` - Utilise maintenant le client admin
   - `/api/admin/orders/[orderId]/reject` - Utilise maintenant le client admin

## Résultat

✅ Toutes les commandes (clients normaux + admin) s'affichent maintenant dans le dashboard
✅ Plus besoin d'authentification Vercel supplémentaire
✅ Les admins peuvent voir et gérer toutes les commandes

## Sécurité

⚠️ **Important** : La service role key contourne toutes les politiques RLS. Elle ne doit être utilisée QUE :
- Dans les API routes admin
- Côté serveur uniquement
- Jamais exposée au client

Le code vérifie toujours que l'utilisateur est admin avant d'utiliser le client admin.

