# Guide de test - Flux d'authentification refondé

## Logique complète refondalisée ✅

### 1. **Route serveur `/auth/callback`** (`app/auth/callback/route.ts`)
- ✅ Reçoit le `code` de Supabase + query params (`next`, `type`)
- ✅ Échange le code pour une session via `supabase.auth.exchangeCodeForSession()`
- ✅ **Crucial** : Redirige AVEC les params `?success=...` ou `?error=...`
  - `type=signup` → `?success=signup_auto_login`
  - `type=magiclink` → `?success=magic_link_login`
  - `type=recovery` → `?success=...` (pas de param, mais redirige vers `/reinitialiser-mot-de-passe`)
  - Erreur → `?error=auth_callback_failed`

### 2. **Composant client `AuthNotification`** (`components/AuthNotification.tsx`)
- ✅ Lit les query params `?success` / `?error` du URL côté client
- ✅ Affiche un **Modal** avec titre + message adapté
- ✅ Fournit une action (bouton) :
  - Success → bouton "Voir mon compte" → `/compte`
  - Error → bouton "Réessayer" → page pertinente
- ✅ Nettoie l'URL après affichage du modal (remove query params)

### 3. **Modal global** (`components/Modal.tsx`)
- ✅ Store Zustand (`useModalStore`)
- ✅ Affichage avec icônes (succès/erreur/info)
- ✅ Accessibilité : focus trap + Escape
- ✅ Action buttons qui naviguent via `useRouter.push()`
- ✅ Animations CSS smooth

### 4. **Middleware** (`middleware.ts`)
- ✅ Route `/auth/callback` publique (ne pas bloquer)
- ✅ Le reste de la logique est inchangée

---

## Tests étape par étape

### Test 1 : Inscription par e-mail
```
1. Allez sur http://localhost:3000/inscription
2. Remplissez :
   - Voornaam: Test
   - Achternaam: User
   - Email: test@exemple.nl
   - Wachtwoord: password123
   - Bevestig: password123
3. Cliquez "Maak account aan"
4. Un email est envoyé par Resend (check .env.local pour RESEND_API_KEY)
5. Cliquez le lien dans l'email → devrait rediriger vers `/auth/callback?code=...&next=/compte&type=signup`
6. **Attendu** : 
   - ✅ Vous êtes connecté (session établie)
   - ✅ Redirigé vers `/compte?success=signup_auto_login`
   - ✅ Modal apparaît : "Compte créé !" avec bouton "Voir mon compte"
   - ✅ URL nettoyée après clic
```

### Test 2 : Magic Link
```
1. Allez sur http://localhost:3000/connexion
2. Entrez email → cliquez "Ontvang een inloglink via e-mail"
3. Check email → cliquez le lien → `/auth/callback?code=...&type=magiclink`
4. **Attendu** :
   - ✅ Connecté
   - ✅ Modal : "Connexion réussie"
   - ✅ Bouton redirige vers `/compte`
```

### Test 3 : Récupération de mot de passe
```
1. Allez sur http://localhost:3000/mot-de-passe-oublie
2. Entrez email → "Verstuur magische link"
3. Check email → cliquez lien → `/auth/callback?code=...&type=recovery`
4. **Attendu** :
   - ✅ Redirigé vers `/reinitialiser-mot-de-passe`
   - ✅ Session de récupération établie
   - ✅ Vous pouvez saisir un nouveau mot de passe
```

### Test 4 : Erreur (lien expiré)
```
1. Allez sur http://localhost:3000/auth/callback?code=invalid123&type=recovery
2. **Attendu** :
   - ✅ Redirigé vers `/mot-de-passe-oublie?error=invalid_or_expired_link`
   - ✅ Modal : "Lien expiré" avec bouton "Réessayer"
```

---

## Commandes de test rapide

```bash
# Rebuild et test
npm run build

# Démarrer serveur prod
npm run start

# Tester route callback (sans code valide)
curl -I "http://127.0.0.1:5000/auth/callback?next=/compte&type=signup"
# Attendu : 307 redirect vers /connexion?error=no_code_provided

# Tester page d'accueil
curl -I http://127.0.0.1:5000/
# Attendu : 200 OK
```

---

## Points clés de la refonte

✅ **Avant (cassé)** :
- Logique client-side doublée (/app/auth/page.tsx)
- Pas de paramètres `?success` dans la redirection
- Modal ne s'affichait pas

✅ **Maintenant (refondé)** :
- Route serveur unique qui gère tout (exchange + redirect)
- Paramètres `?success` / `?error` systématiquement
- Modal client qui écoute ces params et affiche automatiquement
- Nettoyage d'URL après affichage
- Accessibilité et animations

