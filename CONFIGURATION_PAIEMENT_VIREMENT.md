# Configuration du Système de Paiement par Virement Bancaire

## 📋 Vue d'ensemble

Ce système permet aux clients de :
1. Passer une commande avec paiement par virement bancaire
2. Téléverser le reçu de virement
3. Recevoir une confirmation une fois le reçu validé par l'admin

L'admin peut :
- Recevoir un email avec le reçu et des boutons pour confirmer/rejeter
- Confirmer ou rejeter depuis le dashboard admin
- Confirmer ou rejeter directement depuis l'email

## 🔧 Configuration requise

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Resend (pour les emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=Essence Féminine <noreply@essencefeminine.nl>

# Email admin (celui qui recevra les notifications de reçus)
ADMIN_EMAIL=admin@essencefeminine.nl
# OU plusieurs emails séparés par des virgules
ADMIN_EMAILS=admin1@essencefeminine.nl,admin2@essencefeminine.nl

# Token secret pour les liens de confirmation/rejet dans les emails
ADMIN_CONFIRMATION_TOKEN=votre-token-secret-tres-securise-changez-moi

# URL du site (pour les liens dans les emails)
NEXT_PUBLIC_SITE_URL=https://essencefeminine.nl
# OU pour Vercel
NEXT_PUBLIC_VERCEL_URL=votre-projet.vercel.app
```

### 2. Configuration Resend

1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre API key
3. Vérifiez votre domaine (ou utilisez le domaine par défaut de Resend)
4. Ajoutez `RESEND_API_KEY` dans `.env.local`

### 3. Configuration Supabase Storage

1. Allez dans votre dashboard Supabase
2. Naviguez vers **Storage**
3. Cliquez sur **Create bucket**
4. Nommez-le `receipts`
5. **Important** : Définissez-le comme **Private** (pas public)
6. Configurez les politiques RLS :

```sql
-- Politique pour permettre aux utilisateurs d'uploader leurs propres reçus
CREATE POLICY "Users can upload their own receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux utilisateurs de voir leurs propres reçus
CREATE POLICY "Users can view their own receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux admins de voir tous les reçus
CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

### 4. Mise à jour de la base de données

Exécutez le script SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Ajouter les colonnes pour le reçu de virement
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS receipt_file_name TEXT;
```

Ou exécutez le fichier : `lib/database/add_receipt_fields.sql`

## 📧 Informations bancaires à configurer

Modifiez les informations bancaires dans `app/checkout/page.tsx` (lignes ~240-260) :

```tsx
<p className="text-lg font-semibold text-brown-dark">ESSENCE FÉMININE B.V.</p>
<p className="text-lg font-mono text-brown-dark">NL91 ABNA 0417 1643 00</p> // Votre IBAN
<p className="text-lg font-mono text-brown-dark">ABNANL2A</p> // Votre BIC
<p className="text-lg text-brown-dark">ABN AMRO Bank N.V.</p> // Votre banque
```

## 🔄 Flux de travail

### Côté client :

1. **Checkout** : Le client remplit ses informations et voit les instructions de virement
2. **Commande créée** : La commande est créée avec le statut `pending`
3. **Virement effectué** : Le client effectue le virement bancaire
4. **Téléversement** : Le client téléverse le reçu sur `/televerser-recu`
5. **Statut mis à jour** : Le statut passe à `processing` et un email est envoyé à l'admin

### Côté admin :

1. **Email reçu** : L'admin reçoit un email avec :
   - Détails de la commande
   - Reçu de virement (image)
   - Boutons "Confirmer" et "Rejeter"

2. **Actions possibles** :
   - **Depuis l'email** : Cliquer sur "Confirmer" ou "Rejeter" (nécessite le token secret)
   - **Depuis le dashboard** : Aller sur `/admin` et utiliser les boutons

3. **Confirmation** :
   - Statut passe à `processing` (si confirmé) ou `cancelled` (si rejeté)
   - `payment_status` passe à `paid` (si confirmé) ou `failed` (si rejeté)
   - Email de confirmation/rejet envoyé au client

## 🔒 Sécurité

- Les reçus sont stockés dans un bucket **privé** Supabase
- Les liens de confirmation/rejet nécessitent un token secret
- Seuls les admins peuvent voir tous les reçus
- Les utilisateurs ne peuvent voir que leurs propres reçus

## 🧪 Test

1. Passez une commande test
2. Téléversez un reçu test (image ou PDF)
3. Vérifiez que l'email arrive à l'admin
4. Testez la confirmation depuis l'email et depuis le dashboard
5. Vérifiez que le client reçoit l'email de confirmation

## 📝 Notes importantes

- Les fichiers uploadés sont limités à **5MB**
- Formats acceptés : JPG, PNG, WEBP, PDF
- Le statut `processing` signifie "en attente de validation du reçu"
- Une fois confirmé, le statut reste `processing` jusqu'à l'expédition
- Les commandes rejetées passent au statut `cancelled`

## 🐛 Dépannage

### L'email n'arrive pas à l'admin
- Vérifiez `RESEND_API_KEY` et `ADMIN_EMAIL`
- Vérifiez les logs dans Resend dashboard
- Vérifiez que le domaine est vérifié dans Resend

### Le téléversement échoue
- Vérifiez que le bucket `receipts` existe dans Supabase Storage
- Vérifiez les politiques RLS du bucket
- Vérifiez la taille du fichier (max 5MB)

### Les boutons dans l'email ne fonctionnent pas
- Vérifiez `ADMIN_CONFIRMATION_TOKEN` dans les deux fichiers
- Vérifiez `NEXT_PUBLIC_SITE_URL` ou `NEXT_PUBLIC_VERCEL_URL`


