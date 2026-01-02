# 🔗 Système de Magic Links - Guide de Mise en Place

## 📋 Étapes d'implémentation

### 1. **Créer la table dans Supabase** 
Tu dois exécuter le script SQL dans le Supabase Dashboard:
- Va dans `Supabase Dashboard` → `SQL Editor`
- Crée une nouvelle query
- Copie le contenu de [MIGRATION_MAGIC_LINKS.sql](./MIGRATION_MAGIC_LINKS.sql)
- Exécute la query

**Ou directement dans ton terminal Supabase CLI:**
```bash
supabase db push
```

### 2. **Variables d'environnement à vérifier**
Assure-toi que tu as dans `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:5000  # Important pour les liens email
```

### 3. **Routes API créées**
- `POST /api/auth/request-magic-link` - Envoie le lien magique par email
- `POST /api/auth/verify-magic-link` - Valide le token et crée la session

### 4. **Pages mises à jour**
- `/connexion` - Formulaire simplifié (email uniquement)
- `/auth/magic` - Page de validation du lien magique

### 5. **Middleware mis à jour**
- Ajout de `/auth/magic` dans les routes publiques

---

## 🔄 Flux utilisateur complet

```
1. Utilisateur entre son email
   ↓
2. POST /api/auth/request-magic-link
   ↓
3. Token généré et stocké (15 min d'expiration)
   ↓
4. Email envoyé via Resend avec lien magique
   ↓
5. Utilisateur clique le lien → /auth/magic?token=xyz
   ↓
6. POST /api/auth/verify-magic-link
   ↓
7. Token validé et marqué comme utilisé
   ↓
8. Session créée avec cookies
   ↓
9. Redirection vers /compte
   ↓
10. Toast de succès 🎉
```

---

## 🔐 Sécurité

✅ **Tokens hashés en BD** - Les tokens ne sont jamais stockés en clair
✅ **Expiration 15 min** - Les liens expirent automatiquement
✅ **Une seule utilisation** - Après utilisation, le token est marqué comme `used`
✅ **Vérification email** - Seuls les emails existants reçoivent un lien
✅ **HttpOnly Cookies** - Session stockée de manière sécurisée
✅ **Service Role Key** - Les opérations administrateur sont protégées

---

## 🧪 Tests

### Test manual du flux:

1. **Aller à `/connexion`**
2. **Entrer un email valide** (un compte doit exister)
3. **Vérifier que le lien est envoyé** et toast "Lien envoyé" apparaît
4. **Vérifier l'email** pour le lien de connexion
5. **Cliquer le lien** → devrait afficher "Vérification..."
6. **Toast de succès** et redirection vers `/compte`

### Vérifier la BD:

```sql
SELECT * FROM magic_links WHERE email = 'test@example.com';
```

---

## 🐛 Troubleshooting

### ❌ "Email invalide ou expiré"
- Vérifier que l'email existe dans `profiles`
- Vérifier que le token n'a pas expiré (15 min max)

### ❌ "Utilisateur non trouvé"
- L'email n'existe pas dans la table `profiles`
- S'assurer que l'inscription crée bien l'utilisateur

### ❌ Pas d'email reçu
- Vérifier la clé `RESEND_API_KEY`
- Vérifier `NEXT_PUBLIC_SITE_URL` pour le lien correct
- Vérifier les logs Resend

### ❌ Pas de redirection après clic
- Vérifier que `/auth/magic` est dans les routes publiques du middleware
- Vérifier les cookies sont bien définis
- Vérifier la console du navigateur pour les erreurs

---

## 📝 Notes importantes

1. **La table `profiles` doit avoir la colonne `email` unique**
2. **Service Role Key est nécessaire** pour les opérations admin
3. **RLS est activé** sur la table `magic_links` pour la sécurité
4. **Les tokens expiérés ne sont pas supprimés automatiquement** (tu peux exécuter `cleanup_expired_magic_links()` pour nettoyer)

---

## 🚀 Prochaines améliorations possibles

- [ ] Nettoyer les tokens expiérés automatiquement (cron job)
- [ ] Ajouter un système de tentatives échouées
- [ ] Log d'authentification pour audit
- [ ] Rate limiting sur `/api/auth/request-magic-link`
- [ ] Resend des emails avec des templates personnalisées

---

**Besoin d'aide ?** Vérifie les logs en terminal et dans Supabase Studio!
