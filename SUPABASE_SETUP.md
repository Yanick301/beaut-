# Configuration Supabase pour Essence Féminine

## 📋 Étapes de Configuration

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte ou se connecter
3. Créer un nouveau projet
4. Noter l'URL du projet et les clés API

### 2. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
```

### 3. Exécuter le schéma SQL

1. Aller dans l'éditeur SQL de Supabase
2. Copier le contenu de `lib/database/schema.sql`
3. Exécuter le script SQL

Cela créera :
- Table `profiles` pour les profils utilisateurs
- Table `orders` pour les commandes
- Table `order_items` pour les articles de commande
- Table `favorites` pour les favoris
- Table `reviews` pour les avis clients
- Table `shipping_addresses` pour les adresses de livraison
- Les politiques de sécurité (Row Level Security)
- Les triggers pour la gestion automatique

### 4. Configurer l'authentification par email

Dans Supabase Dashboard :
1. Aller dans Authentication > Settings
2. Activer "Enable email confirmations" si souhaité
3. Configurer les templates d'email :
   - Email de confirmation
   - Email de réinitialisation de mot de passe
   - Email Magic Link

### 5. Personnaliser les emails

Dans Authentication > Email Templates, vous pouvez personnaliser :

- **Confirm signup** : Email de confirmation d'inscription
- **Magic Link** : Email pour connexion sans mot de passe
- **Change Email Address** : Changement d'email
- **Reset Password** : Réinitialisation de mot de passe

### 6. Configuration des URLs de redirection

**IMPORTANT** : Cette configuration est essentielle pour que les liens d'email fonctionnent !

Dans Authentication > URL Configuration, ajouter :

**Site URL :**
- Développement : `http://localhost:3000`
- Production : `https://essencefeminine.nl`

**Redirect URLs (ajouter TOUTES ces URLs) :**

Pour le développement :
```
http://localhost:3000/auth/callback
http://localhost:3000/compte
http://localhost:3000/reinitialiser-mot-de-passe
```

Pour la production :
```
https://essencefeminine.nl/auth/callback
https://essencefeminine.nl/compte
https://essencefeminine.nl/reinitialiser-mot-de-passe
```

**Format avec wildcard (recommandé) :**
```
http://localhost:3000/auth/callback?next=*
https://essencefeminine.nl/auth/callback?next=*
```

Voir le fichier `CONFIGURATION_AUTH_LINKS.md` pour plus de détails.

### 7. Test de l'authentification

1. Lancer le serveur de développement : `npm run dev`
2. Aller sur `/inscription` pour créer un compte
3. Vérifier l'email de confirmation
4. Se connecter sur `/connexion`

## 📧 Configuration des Emails

Supabase gère automatiquement l'envoi d'emails pour :
- ✅ Confirmation d'inscription
- ✅ Réinitialisation de mot de passe
- ✅ Magic Link (connexion sans mot de passe)
- ✅ Changement d'email

Vous pouvez utiliser le service email par défaut de Supabase ou configurer votre propre SMTP dans Authentication > Settings > SMTP Settings.

## 🔒 Sécurité (Row Level Security)

Toutes les tables ont des politiques RLS activées :
- Les utilisateurs ne peuvent voir/modifier que leurs propres données
- Les avis sont publics en lecture, mais seul le créateur peut modifier/supprimer
- Les commandes sont privées par utilisateur

## 📊 Structure de la Base de Données

### Tables Principales

1. **profiles** - Profils utilisateurs (lié à auth.users)
2. **orders** - Commandes clients
3. **order_items** - Articles dans les commandes
4. **favorites** - Produits favoris
5. **reviews** - Avis clients
6. **shipping_addresses** - Adresses de livraison

## 🔧 Fonctionnalités Implémentées

- ✅ Inscription avec email/password
- ✅ Connexion avec email/password
- ✅ Connexion par Magic Link
- ✅ Réinitialisation de mot de passe
- ✅ Gestion de session
- ✅ Profil utilisateur
- ✅ Déconnexion
- ✅ Protection des routes (middleware)
- ✅ Données structurées pour les commandes, favoris, avis

## 📝 Prochaines Étapes

1. Configurer les emails SMTP personnalisés (optionnel)
2. Ajouter l'intégration des commandes avec le panier
3. Implémenter la gestion des adresses de livraison
4. Ajouter le système de favoris
5. Implémenter le système d'avis clients






