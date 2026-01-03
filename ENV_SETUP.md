# Configuration des Variables d'Environnement

## 1. Créer le fichier .env.local

Ce fichier est indispensable pour que l'application fonctionne (Authentification, Base de données, Emails).
Copiez le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Ou créez-le manuellement avec ce contenu :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-supabase

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend (Emails)
RESEND_API_KEY=re_123...
RESEND_FROM_EMAIL="Her Essence <noreply@heressence.nl>"

# Admin Configuration
ADMIN_EMAILS=admin@example.com
```

## 2. Où trouver les valeurs ?

### Supabase
1. Allez sur [supabase.com](https://supabase.com) > Settings > API.
2. Copiez **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`.
3. Copiez **anon public** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copiez **service_role** -> `SUPABASE_SERVICE_ROLE_KEY` (Secret ! Ne jamais partager).

### Resend (Emails)
1. Allez sur [resend.com](https://resend.com) > API Keys.
2. Créez une nouvelle clé avec permission "Sending access".
3. Copiez la clé -> `RESEND_API_KEY`.
4. Ajoutez et vérifiez votre domaine dans "Domains".

### App
- En local : `http://localhost:3000`
- En production : `https://heressence.nl` (ou votre URL Vercel)

## ⚠️ Important
- Ne commitez JAMAIS `.env.local` sur Git.
- Si vous changez `NEXT_PUBLIC_SITE_URL` en production, mettez aussi à jour les **Redirect URLs** dans Supabase Auth > URL Configuration.
