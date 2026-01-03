# 🧪 Test du Flux Magic Links - Guide complet

## ✅ Checklist de test

### 1️⃣ **Test d'Inscription**
- [ ] Aller à `/inscription`
- [ ] Remplir : Prénom, Nom, Email
- [ ] Cliquer "Créer mon compte"
- [ ] **Résultat attendu** :
  - Toast "Création du compte..."
  - Toast de succès "Compte créé !"
  - Redirection vers `/connexion`
  - Utilisateur créé dans `profiles` table

### 2️⃣ **Test de Demande de Magic Link**
- [ ] Aller à `/connexion`
- [ ] Entrer l'email d'un compte existant
- [ ] Cliquer "Recevoir un lien de connexion"
- [ ] **Résultat attendu** :
  - Toast "Envoi du lien..."
  - Toast de succès "Lien envoyé !"
  - Message "Vérifiez votre email"
  - Formulaire masqué, message affiché

**Vérifications en BD:**
```sql
-- Vérifier le token créé
SELECT email, used, expires_at FROM magic_links 
WHERE email = 'votre@email.com' 
ORDER BY created_at DESC LIMIT 1;
```

### 3️⃣ **Test du Lien Magique**
- [ ] Aller à Resend ou console backend pour récupérer le token
- [ ] Copier le lien `/auth/magic?token=xxx`
- [ ] **Résultat attendu** :
  - Spinner "Vérification..."
  - Toast "Vérification de votre lien..."
  - Toast "Connexion réussie !"
  - Redirection vers `/compte`
  - User est connecté ✅

**Vérifications en BD:**
```sql
-- Vérifier que le token est marqué comme utilisé
SELECT email, used FROM magic_links 
WHERE email = 'votre@email.com' 
ORDER BY created_at DESC LIMIT 1;
-- Résultat : used = true
```

### 4️⃣ **Test de Session**
- [ ] Une fois connecté, aller à `/compte`
- [ ] **Résultat attendu** :
  - Page accessible (utilisateur est vraiment connecté)
  - Informations du profil affichées
  - Cookies `sb-access-token` et `sb-refresh-token` présents

**Vérification dans DevTools:**
```javascript
// Console
document.cookie
// Devrait afficher les cookies Supabase
```

### 5️⃣ **Test d'Erreurs**

#### Token Invalide
- [ ] Modifier le token dans l'URL `/auth/magic?token=INVALIDE`
- [ ] **Résultat attendu** :
  - Toast d'erreur "Lien invalide ou expiré"
  - Bouton "Retour à la connexion"
  - Page d'erreur affichée

#### Token Expiré
- [ ] Attendre 15+ minutes puis cliquer le lien
- [ ] **Résultat attendu** :
  - Toast "Lien expiré"
  - Redirection vers `/connexion`

#### Token Déjà Utilisé
- [ ] Cliquer deux fois le même lien
- [ ] **Résultat attendu** :
  - Premier clic = succès ✅
  - Deuxième clic = erreur "Lien déjà utilisé"

#### Email N'existe Pas
- [ ] Entrer un email qui n'existe pas dans `/connexion`
- [ ] Demander un magic link
- [ ] **Résultat attendu** :
  - Toast neutre "Si cet email existe..." (pour sécurité)
  - Aucun email envoyé
  - Aucun token créé en BD

### 6️⃣ **Test de Déconnexion/Reconnexion**
- [ ] Une fois connecté, aller à `/compte`
- [ ] Cliquer sur "Déconnexion" (si disponible)
- [ ] Vérifier redirection vers `/connexion`
- [ ] Cookies supprimés
- [ ] Recommencer le flux de connexion

---

## 📊 Vérifications BD Complètes

### Magic Links
```sql
-- Voir tous les liens générés
SELECT id, email, used, expires_at, created_at 
FROM magic_links 
ORDER BY created_at DESC;

-- Voir les liens actifs (non utilisés + non expirés)
SELECT id, email, expires_at 
FROM magic_links 
WHERE NOT used AND expires_at > NOW()
ORDER BY created_at DESC;

-- Voir les liens expiérés
SELECT id, email, expires_at 
FROM magic_links 
WHERE expires_at < NOW()
ORDER BY created_at DESC;
```

### Utilisateurs Créés
```sql
-- Voir les profiles créés
SELECT id, email, first_name, last_name, created_at 
FROM profiles 
ORDER BY created_at DESC LIMIT 10;

-- Voir les utilisateurs Supabase Auth
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC LIMIT 10;
```

### Intégrité Référentielle
```sql
-- Vérifier que tous les magic_links pointent vers des utilisateurs
SELECT ml.email, ml.user_id, p.id 
FROM magic_links ml
LEFT JOIN profiles p ON p.email = ml.email
WHERE p.id IS NULL;
-- Résultat : aucune ligne (tout est lié)
```

---

## 🐛 Debugging

### Logs à vérifier
1. **Browser Console** (F12)
   - Erreurs JavaScript
   - Requêtes fetch
   - Erreurs Supabase

2. **Server Logs** (Terminal)
   - Erreurs API
   - Logs des routes

3. **Resend Dashboard**
   - Emails envoyés/échoués
   - Contenu des emails

### Variables à tester
```javascript
// Console Browser
// Vérifier le token
const params = new URLSearchParams(window.location.search);
console.log('Token:', params.get('token'));

// Vérifier les cookies
console.log('Cookies:', document.cookie);

// Vérifier l'utilisateur actuel
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
console.log('Utilisateur:', user);
```

---

## 🎯 Checklist finale avant production

- [ ] Table `magic_links` créée
- [ ] API `/api/auth/request-magic-link` fonctionne
- [ ] API `/api/auth/verify-magic-link` fonctionne
- [ ] Page `/auth/magic` fonctionne
- [ ] Page `/connexion` simplifiée
- [ ] Page `/inscription` met à jour les profils
- [ ] Middleware accepte `/auth/magic`
- [ ] Toasts apparaissent correctement
- [ ] Cookies sont définis après authentification
- [ ] Redirection `/compte` fonctionne
- [ ] Email reçoit les liens (Resend OK)
- [ ] Tokens expirent après 15 min
- [ ] Tokens utilisables une seule fois

---

## 📝 Notes

- Les tokens sont hachés en SHA256 avant stockage
- Expiration définie à 15 minutes (configurable)
- Service Role Key utilisée pour les opérations admin
- RLS strict : aucun accès direct aux tokens
- Notifications toast guident l'utilisateur

---

**Bon testing! 🚀**
