# Configuration du Dashboard Admin

## 📋 Prérequis

1. Avoir Supabase configuré et fonctionnel
2. Avoir au moins un compte utilisateur créé
3. Exécuter le script SQL pour ajouter le support admin

## 🔧 Configuration

### 1. Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
# Liste des emails admin (séparés par des virgules)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

**Important** : Remplacez `admin@example.com` par votre vraie adresse email d'administrateur.

### 2. Base de données

Exécutez le script SQL dans l'éditeur SQL de Supabase :

```sql
-- Ajouter la colonne is_admin
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Créer un index
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
```

### 3. Définir un utilisateur comme admin

Deux méthodes :

#### Méthode 1 : Via l'email (recommandé pour commencer)

Ajoutez simplement l'email de l'utilisateur dans `ADMIN_EMAILS` dans `.env.local`. Cette méthode ne nécessite pas de modifier la base de données.

#### Méthode 2 : Via la base de données

```sql
-- Remplacer 'admin@example.com' par l'email de l'admin
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

## 🔐 Système d'authentification Admin

Le système admin utilise deux mécanismes :

1. **Liste d'emails** : Les emails définis dans `ADMIN_EMAILS` ont automatiquement accès
2. **Colonne is_admin** : Les utilisateurs avec `is_admin = true` dans leur profil ont aussi accès

Les deux méthodes fonctionnent indépendamment ou ensemble.

## 📍 Accès au Dashboard

Une fois configuré, accédez au dashboard via :
- URL : `http://localhost:3000/admin` (développement)
- URL : `https://votre-domaine.com/admin` (production)

**Étapes pour accéder :**
1. Connectez-vous avec le compte admin sur `/connexion`
2. Allez sur `/admin`
3. Si vous n'êtes pas connecté, vous serez automatiquement redirigé vers la page de connexion

**Voir le guide complet** : `GUIDE_ADMIN.md` pour des instructions détaillées.

## ✨ Fonctionnalités du Dashboard

### Statistiques
- Nombre total de commandes
- Commandes par statut (en attente, en traitement, expédiées, livrées, annulées)
- Chiffre d'affaires total

### Filtres
- Filtrer les commandes par statut
- Voir toutes les commandes ou un statut spécifique

### Gestion des commandes
- **Confirmer** : Passe une commande "en attente" à "en traitement"
- **Rejeter** : Passe une commande à "annulée"
- **Marquer comme expédiée** : Passe de "en traitement" à "expédiée"
- **Marquer comme livrée** : Passe de "expédiée" à "livrée"
- **Annuler** : Permet d'annuler une commande à n'importe quel moment (sauf si déjà livrée)

### Informations affichées
- Numéro de commande
- Statut de la commande
- Informations client (nom, email)
- Date de commande
- Total de la commande
- Adresse de livraison
- Liste détaillée des articles avec quantités et prix

## 🔒 Sécurité

- L'authentification est vérifiée sur chaque requête API
- Seuls les utilisateurs avec les droits admin peuvent accéder
- Les routes API `/api/admin/*` vérifient les permissions
- Le middleware redirige vers la connexion si non authentifié

## 📝 Statuts des commandes

Les statuts possibles sont :
- `pending` : En attente (nouvelle commande)
- `processing` : En traitement (confirmée par l'admin)
- `shipped` : Expédiée (en cours de livraison)
- `delivered` : Livrée (commande complétée)
- `cancelled` : Annulée (rejetée ou annulée)

## 🚀 Prochaines améliorations possibles

- Export des commandes en CSV/Excel
- Recherche de commandes par numéro ou client
- Filtrage par date
- Notifications en temps réel des nouvelles commandes
- Interface pour gérer les produits
- Gestion des stocks
- Rapports et analytics avancés




