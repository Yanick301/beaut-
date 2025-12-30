# Configuration des Liens d'Authentification

## 🔧 Problème résolu

Les liens de confirmation d'inscription et de réinitialisation de mot de passe ne fonctionnaient pas car :
1. Les URLs de redirection n'étaient pas correctement configurées
2. Il manquait une route API pour gérer les callbacks Supabase
3. Les URLs n'étaient pas configurées dans le dashboard Supabase

## ✅ Solutions implémentées

### 1. Route API de callback créée

Une nouvelle route `/app/auth/callback/route.ts` a été créée pour gérer les callbacks d'authentification Supabase.

### 2. URLs de redirection améliorées

Les URLs utilisent maintenant :
- `NEXT_PUBLIC_SITE_URL` (variable d'environnement) en priorité
- `window.location.origin` en fallback
- Route de callback : `/auth/callback?next=/compte` ou `/auth/callback?next=/reinitialiser-mot-de-passe`

## 📋 Configuration requise

### 1. Variables d'environnement

Ajoutez dans votre `.env.local` :

```env
NEXT_PUBLIC_SITE_URL=https://essencefeminine.nl
# OU pour le développement local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Configuration Supabase Dashboard

**IMPORTANT** : Vous devez configurer les URLs de redirection dans Supabase :

1. Allez dans votre **Supabase Dashboard**
2. Naviguez vers **Authentication** > **URL Configuration**
3. Dans **Site URL**, ajoutez :
   - Développement : `http://localhost:3000`
   - Production : `https://essencefeminine.nl`

4. Dans **Redirect URLs**, ajoutez **TOUTES** ces URLs :

**Pour le développement local :**
```
http://localhost:3000/auth/callback
http://localhost:3000/compte
http://localhost:3000/reinitialiser-mot-de-passe
```

**Pour la production :**
```
https://essencefeminine.nl/auth/callback
https://essencefeminine.nl/compte
https://essencefeminine.nl/reinitialiser-mot-de-passe
```

**Format avec paramètres (optionnel mais recommandé) :**
```
http://localhost:3000/auth/callback?next=*
https://essencefeminine.nl/auth/callback?next=*
```

### 3. Configuration des emails Supabase

Dans **Authentication** > **Email Templates**, vérifiez que les templates contiennent bien les liens de redirection :

**Template "Confirm signup" :**
```
{{ .ConfirmationURL }}
```

**Template "Reset Password" :**
```
{{ .ConfirmationURL }}
```

## 🔄 Flux de travail

### Inscription :

1. Utilisateur s'inscrit → Email envoyé avec lien de confirmation
2. Utilisateur clique sur le lien → Redirigé vers `/auth/callback?next=/compte`
3. Route API vérifie le token → Redirige vers `/compte`
4. Utilisateur est connecté automatiquement

### Réinitialisation de mot de passe :

1. Utilisateur demande réinitialisation → Email envoyé avec lien
2. Utilisateur clique sur le lien → Redirigé vers `/auth/callback?next=/reinitialiser-mot-de-passe`
3. Route API vérifie le token → Redirige vers `/reinitialiser-mot-de-passe`
4. Utilisateur peut définir un nouveau mot de passe

## 🧪 Test

### Test d'inscription :

1. Allez sur `/inscription`
2. Créez un compte
3. Vérifiez votre email
4. Cliquez sur le lien de confirmation
5. Vous devriez être redirigé vers `/compte` et connecté automatiquement

### Test de réinitialisation :

1. Allez sur `/mot-de-passe-oublie`
2. Entrez votre email
3. Vérifiez votre email
4. Cliquez sur le lien de réinitialisation
5. Vous devriez être redirigé vers `/reinitialiser-mot-de-passe`
6. Définissez un nouveau mot de passe

## 🐛 Dépannage

### Le lien ne fonctionne pas / Erreur "Invalid token"

**Causes possibles :**
1. L'URL de redirection n'est pas dans la liste des Redirect URLs de Supabase
2. Le token a expiré (les tokens expirent après 1 heure par défaut)
3. Le token a déjà été utilisé

**Solutions :**
- Vérifiez que toutes les URLs sont bien configurées dans Supabase Dashboard
- Demandez un nouveau lien de confirmation/réinitialisation
- Vérifiez que `NEXT_PUBLIC_SITE_URL` correspond à votre domaine

### Redirection vers une page d'erreur

**Causes possibles :**
- La route `/auth/callback` n'existe pas (elle devrait être créée maintenant)
- Le paramètre `next` n'est pas valide

**Solutions :**
- Vérifiez que le fichier `/app/auth/callback/route.ts` existe
- Vérifiez les logs du serveur pour voir l'erreur exacte

### L'utilisateur n'est pas connecté après confirmation

**Causes possibles :**
- La session n'est pas correctement établie
- Le middleware bloque l'accès

**Solutions :**
- Vérifiez que le middleware ne redirige pas trop tôt
- Vérifiez que la session est bien créée dans Supabase

## 📝 Notes importantes

- Les tokens de confirmation expirent après **1 heure** par défaut
- Les tokens ne peuvent être utilisés **qu'une seule fois**
- Si vous changez `NEXT_PUBLIC_SITE_URL`, mettez à jour aussi les Redirect URLs dans Supabase
- Pour la production, utilisez toujours HTTPS

## 🔒 Sécurité

- Les tokens sont vérifiés côté serveur
- Les URLs de redirection sont validées par Supabase
- Seules les URLs autorisées dans Supabase Dashboard peuvent être utilisées













