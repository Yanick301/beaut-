# Configuratie van het Admin Dashboard

## 📋 Vereisten

1. Supabase geconfigureerd en functioneel hebben
2. Minstens één gebruikersaccount aangemaakt hebben
3. SQL-script uitvoeren om admin-functionaliteit toe te voegen

## 🔧 Configuratie

### 1. Omgevingsvariabelen

Voeg toe aan uw `.env.local` bestand:

```env
# Lijst van admin e-mails (gescheiden door komma's)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

**Belangrijk** : Vervang `admin@example.com` door uw echte admin e-mailadres.

### 2. Database

Voer het SQL-script uit in de SQL-editor van Supabase:

```sql
-- Kolom is_admin toevoegen
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Index aanmaken
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
```

### 3. Een gebruiker als admin instellen

Twee methodes:

#### Methode 1 : Via e-mail (aanbevolen om mee te beginnen)

Voeg eenvoudig het e-mailadres van de gebruiker toe aan `ADMIN_EMAILS` in `.env.local`. Deze methode vereist geen aanpassing van de database.

#### Methode 2 : Via de database

```sql
-- Vervang 'admin@example.com' door het e-mailadres van de admin
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

## 🔐 Admin authenticatiesysteem

Het admin systeem gebruikt twee mechanismen:

1. **Emaillijst** : E-mails gedefinieerd in `ADMIN_EMAILS` hebben automatisch toegang
2. **Kolom is_admin** : Gebruikers met `is_admin = true` in hun profiel hebben ook toegang

Beide methodes werken onafhankelijk of samen.

## 📍 Toegang tot het Dashboard

Eenmaal geconfigureerd, kunt u toegang krijgen tot het dashboard via:
- URL : `http://localhost:3000/admin` (ontwikkeling)
- URL : `https://votre-domaine.com/admin` (productie)

**Stappen voor toegang:**
1. Log in met het admin account op `/connexion`
2. Ga naar `/admin`
3. Als u niet bent ingelogd, wordt u automatisch doorgestuurd naar de inlogpagina

**Zie de volledige gids** : `GUIDE_ADMIN.md` voor gedetailleerde instructies.

## ✨ Functionaliteiten van het Dashboard

### Statistieken
- Totaal aantal bestellingen
- Bestellingen per status (in behandeling, in verwerking, verzonden, geleverd, geannuleerd)
- Totale omzet

### Filters
- Bestellingen filteren op status
- Alle bestellingen of een specifieke status bekijken

### Bestellingbeheer
- **Bevestigen** : Zet een bestelling van "in behandeling" naar "in verwerking"
- **Afwijzen** : Zet een bestelling naar "geannuleerd"
- **Markeren als verzonden** : Verandert van "in verwerking" naar "verzonden"
- **Markeren als geleverd** : Verandert van "verzonden" naar "geleverd"
- **Annuleren** : Maakt het mogelijk een bestelling op elk moment te annuleren (behalve als deze al is geleverd)

### Weergegeven informatie
- Bestelnummer
- Bestelstatus
- Klantinformatie (naam, e-mail)
- Besteldatum
- Totaalbestelling
- Bezorgadres
- Gedetailleerde lijst van artikelen met hoeveelheden en prijzen

## 🔒 Beveiliging

- Authenticatie wordt gecontroleerd bij elk API-verzoek
- Alleen gebruikers met adminrechten hebben toegang
- API-routes `/api/admin/*` controleren de rechten
- De middleware stuurt door naar login als niet geauthenticeerd

## 📝 Bestelstatussen

Mogelijke statussen zijn:
- `pending` : In behandeling (nieuwe bestelling)
- `processing` : In verwerking (bevestigd door admin)
- `shipped` : Verzonden (onderweg)
- `delivered` : Geleverd (bestelling voltooid)
- `cancelled` : Geannuleerd (afgewezen of geannuleerd)

## 🚀 Mogelijke toekomstige verbeteringen

- Exporteren van bestellingen naar CSV/Excel
- Zoeken van bestellingen op nummer of klant
- Filteren op datum
- Realtime meldingen van nieuwe bestellingen
- Interface om producten te beheren
- Voorraadbeheer
- Geavanceerde rapporten en analytics




