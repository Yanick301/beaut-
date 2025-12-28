# Configuration des Variables d'Environnement

## Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-supabase

# Admin Configuration (optionnel)
# Liste des emails admin séparés par des virgules
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

## Comment obtenir ces valeurs

1. Aller sur [supabase.com](https://supabase.com) et se connecter
2. Sélectionner votre projet (ou en créer un nouveau)
3. Aller dans **Settings** > **API**
4. Copier :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (gardez cette clé secrète !)

## Important

- ⚠️ Ne jamais commiter le fichier `.env.local` dans Git
- ⚠️ La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit être utilisée que côté serveur
- ✅ Le fichier `.env.local` est déjà dans `.gitignore`




