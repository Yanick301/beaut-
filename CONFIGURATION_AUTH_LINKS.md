# Configuratie van Authenticatielinks

## 🔧 Probleem opgelost

De links voor accountbevestiging en wachtwoordherstel werkten niet omdat:
1. De redirect URL's waren niet correct geconfigureerd
2. Er ontbrak een API-route om de Supabase callbacks te verwerken
3. De URL's waren niet geconfigureerd in het Supabase dashboard

## ✅ Geïmplementeerde oplossingen

### 1. Callback API-route aangemaakt

Een nieuwe route `/app/auth/callback/route.ts` is aangemaakt om de Supabase authenticatie callbacks te verwerken.

### 2. Verbeterde redirect URL's

De URL's gebruiken nu:
- `NEXT_PUBLIC_SITE_URL` (omgevingsvariabele) als prioriteit
- `window.location.origin` als fallback
- Callback route: `/auth/callback?next=/compte` of `/auth/callback?next=/reinitialiser-mot-de-passe`

## 📋 Vereiste configuratie

### 1. Omgevingsvariabelen

Voeg toe aan uw `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://essencefeminine.nl
# OU pour le développement local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Configuratie van het Supabase Dashboard

**BELANGRIJK** : U moet de redirect URL's configureren in Supabase:

1. Ga naar uw **Supabase Dashboard**
2. Navigeer naar **Authentication** > **URL Configuration**
3. In **Site URL**, voeg toe:
   - Ontwikkeling: `http://localhost:3000`
   - Productie: `https://essencefeminine.nl`

4. In **Redirect URLs**, voeg **ALLE** deze URL's toe:

**Voor lokale ontwikkeling:**
```
http://localhost:3000/auth/callback
http://localhost:3000/compte
http://localhost:3000/reinitialiser-mot-de-passe
```

**Voor productie:**
```
https://essencefeminine.nl/auth/callback
https://essencefeminine.nl/compte
https://essencefeminine.nl/reinitialiser-mot-de-passe
```

**Formaat met parameters (optioneel maar aanbevolen):**
```
http://localhost:3000/auth/callback?next=*
https://essencefeminine.nl/auth/callback?next=*
```

### 3. Configuratie van Supabase e-mails

In **Authentication** > **Email Templates**, controleer of de sjablonen de redirect links bevatten:

**Sjabloon "Confirm signup":**
```
{{ .ConfirmationURL }}
```

**Sjabloon "Reset Password":**
```
{{ .ConfirmationURL }}
```

## 🔄 Workflow

### Registratie:

1. Gebruiker registreert → E-mail verzonden met bevestigingslink
2. Gebruiker klikt op de link → Omgeleid naar `/auth/callback?next=/compte`
3. API-route controleert het token → Omleiding naar `/compte`
4. Gebruiker is automatisch ingelogd

### Wachtwoordherstel:

1. Gebruiker vraagt herstel aan → E-mail verzonden met link
2. Gebruiker klikt op de link → Omgeleid naar `/auth/callback?next=/reinitialiser-mot-de-passe`
3. API-route controleert het token → Omleiding naar `/reinitialiser-mot-de-passe`
4. Gebruiker kan nieuw wachtwoord instellen

## 🧪 Testen

### Testregistratie:

1. Ga naar `/inscription`
2. Maak een account aan
3. Controleer uw e-mail
4. Klik op de bevestigingslink
5. U zou naar `/compte` moeten worden omgeleid en automatisch ingelogd worden

### Test wachtwoordherstel:

1. Ga naar `/mot-de-passe-oublie`
2. Voer uw e-mail in
3. Controleer uw e-mail
4. Klik op de herstel-link
5. U zou naar `/reinitialiser-mot-de-passe` moeten worden omgeleid
6. Stel een nieuw wachtwoord in

## 🐛 Probleemoplossing

### De link werkt niet / Foutmelding "Invalid token"

**Mogelijke oorzaken:**
1. De redirect URL staat niet in de lijst van Redirect URL's van Supabase
2. Het token is verlopen (tokens verlopen standaard na 1 uur)
3. Het token is al gebruikt

**Oplossingen:**
- Controleer of alle URL's correct zijn geconfigureerd in het Supabase Dashboard
- Vraag een nieuwe bevestigings-/herstel-link aan
- Controleer of `NEXT_PUBLIC_SITE_URL` overeenkomt met uw domein

### Omleiding naar een foutpagina

**Mogelijke oorzaken:**
### De route `/auth/callback` bestaat niet (deze zou nu aangemaakt moeten zijn)
### De parameter `next` is niet geldig

**Oplossingen:**
### Controleer of het bestand `/app/auth/callback/route.ts` bestaat
### Controleer de serverlogs om de exacte fout te zien

### Gebruiker is niet ingelogd na bevestiging

**Mogelijke oorzaken:**
### De sessie is niet correct opgezet
### De middleware blokkeert de toegang

**Oplossingen:**
### Controleer of de middleware niet te vroeg omleidt
### Controleer of de sessie correct is aangemaakt in Supabase

## 📝 Notes importantes

### Bevestigingstokens verlopen standaard na **1 uur**
### Tokens kunnen **slechts één keer** worden gebruikt
### Als u `NEXT_PUBLIC_SITE_URL` wijzigt, update dan ook de Redirect URL's in Supabase
- Voor productie, gebruik altijd HTTPS

## 🔒 Beveiliging

### Tokens worden aan de serverzijde gecontroleerd
### Redirect URL's worden gevalideerd door Supabase
### Alleen de geautoriseerde URL's in het Supabase Dashboard kunnen worden gebruikt














