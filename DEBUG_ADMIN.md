# 🔍 Guide de Débogage - Dashboard Admin

## Problèmes courants et solutions

### 1. Les boutons ne fonctionnent pas

**Symptômes :**
- Les boutons "Confirmer", "Rejeter", "Annuler" ne font rien
- Message d'erreur générique

**Solutions :**

1. **Ouvrir la console du navigateur (F12)**
   - Allez dans l'onglet "Console"
   - Cliquez sur un bouton
   - Regardez les erreurs affichées

2. **Vérifier les erreurs réseau**
   - Allez dans l'onglet "Network" (Réseau)
   - Cliquez sur un bouton
   - Regardez la requête vers `/api/admin/orders/...`
   - Vérifiez le statut de la réponse (200 = OK, 401 = Non authentifié, 403 = Accès refusé, 500 = Erreur serveur)

3. **Vérifier que vous êtes bien admin**
   ```sql
   -- Dans Supabase SQL Editor
   SELECT u.email, p.is_admin 
   FROM auth.users u
   LEFT JOIN public.profiles p ON u.id = p.id
   WHERE u.email = 'votre-email@example.com';
   ```

### 2. L'email n'arrive pas à l'admin

**Symptômes :**
- Le reçu est téléversé mais l'admin ne reçoit pas l'email
- Pas d'erreur visible

**Vérifications :**

1. **Variables d'environnement dans Vercel**
   - Allez dans Vercel Dashboard > Votre projet > Settings > Environment Variables
   - Vérifiez que ces variables existent :
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     RESEND_FROM_EMAIL=Essence Féminine <noreply@essencefeminine.nl>
     ADMIN_EMAIL=admin@essencefeminine.nl
     ADMIN_EMAILS=admin@essencefeminine.nl
     ADMIN_CONFIRMATION_TOKEN=votre-token-secret
     ```

2. **Vérifier les logs Vercel**
   - Allez dans Vercel Dashboard > Votre projet > Deployments > Cliquez sur le dernier déploiement > Functions
   - Regardez les logs pour voir les erreurs

3. **Vérifier Resend Dashboard**
   - Allez sur [resend.com](https://resend.com) > Dashboard > Logs
   - Regardez si les emails sont envoyés ou s'il y a des erreurs

4. **Vérifier le domaine dans Resend**
   - Allez dans Resend Dashboard > Domains
   - Vérifiez que votre domaine est vérifié
   - Si vous utilisez le domaine par défaut de Resend, vérifiez qu'il est actif

### 3. Erreur "Non authentifié" ou "Accès refusé"

**Solutions :**

1. **Déconnectez-vous et reconnectez-vous**
   - Allez sur `/connexion`
   - Déconnectez-vous
   - Reconnectez-vous avec votre compte admin

2. **Vérifiez que vous êtes admin**
   - Vérifiez dans Supabase que `is_admin = true` pour votre compte
   - OU vérifiez que votre email est dans `ADMIN_EMAILS`

### 4. Erreur lors de la mise à jour de la commande

**Vérifications :**

1. **Vérifier les politiques RLS**
   - Exécutez le script `lib/database/admin_rls_policies.sql` dans Supabase
   - Vérifiez que les politiques permettent aux admins de mettre à jour les commandes

2. **Vérifier les logs Supabase**
   - Allez dans Supabase Dashboard > Logs > Postgres Logs
   - Regardez les erreurs récentes

## Commandes de débogage

### Tester l'API directement

```bash
# Tester la confirmation (remplacez ORDER_ID et votre token)
curl -X POST https://votre-site.com/api/admin/orders/ORDER_ID/confirm \
  -H "Content-Type: application/json" \
  -H "Cookie: votre-cookie-de-session"
```

### Vérifier les variables d'environnement

Dans Vercel, allez dans Settings > Environment Variables et vérifiez :
- ✅ `RESEND_API_KEY` existe et est valide
- ✅ `ADMIN_EMAIL` ou `ADMIN_EMAILS` existe
- ✅ `RESEND_FROM_EMAIL` existe
- ✅ `ADMIN_CONFIRMATION_TOKEN` existe

## Logs à vérifier

1. **Console du navigateur (F12)**
   - Erreurs JavaScript
   - Erreurs de fetch/API

2. **Network tab (F12 > Network)**
   - Statut des requêtes API
   - Corps des réponses d'erreur

3. **Vercel Function Logs**
   - Erreurs serveur
   - Logs console.log

4. **Resend Dashboard**
   - Emails envoyés
   - Erreurs d'envoi

## Test rapide

1. Ouvrez la console du navigateur (F12)
2. Allez sur `/admin`
3. Cliquez sur "Confirmer le paiement" pour une commande
4. Regardez :
   - La requête dans l'onglet Network
   - Les erreurs dans la console
   - Le message d'alerte affiché

Si vous voyez une erreur spécifique, notez-la et vérifiez la section correspondante ci-dessus.













