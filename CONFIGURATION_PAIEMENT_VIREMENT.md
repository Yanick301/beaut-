# Configuratie van het Bankoverschrijvingsbetalingsysteem

## 📋 Overzicht

Dit systeem stelt klanten in staat om:
1. Een bestelling plaatsen met betaling via bankoverschrijving
2. Het overschrijvingsbewijs uploaden
3. Een bevestiging te ontvangen zodra het bewijs is gevalideerd door de admin

De admin kan:
- Een e-mail ontvangen met het bewijs en knoppen om te bevestigen/afwijzen
- Bevestigen of afwijzen vanuit het admin dashboard
- Bevestigen of afwijzen direct vanuit de e-mail

## 🔧 Vereiste configuratie

### 1. Omgevingsvariabelen

Voeg deze variabelen toe aan uw `.env.local` bestand:

```env
# Resend (voor e-mails)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=Her Essence <noreply@heressence.nl>

# Admin e-mail (deze ontvangt de meldingen van bewijzen)
ADMIN_EMAIL=admin@heressence.nl
# OF meerdere e-mails gescheiden door komma's
ADMIN_EMAILS=admin1@heressence.nl,admin2@heressence.nl

# Geheime token voor de bevestiging/afwijzing links in de e-mails
ADMIN_CONFIRMATION_TOKEN=uw-geheime-token-zeer-beveiligd-verander-mij

# Site URL (voor de links in de e-mails)
NEXT_PUBLIC_SITE_URL=https://heressence.nl
# OF voor Vercel
NEXT_PUBLIC_VERCEL_URL=uw-project.vercel.app
```

### 2. Resend-configuratie

1. Maak een account aan op [resend.com](https://resend.com)
2. Verkrijg uw API-sleutel
3. Verifieer uw domein (of gebruik het standaarddomein van Resend)
4. Voeg `RESEND_API_KEY` toe aan `.env.local`

### 3. Supabase Storage-configuratie

1. Ga naar uw Supabase dashboard
2. Navigeer naar **Storage**
3. Klik op **Create bucket**
4. Noem het `receipts`
5. **Belangrijk** : Stel het in op **Private** (niet openbaar)
6. Configureer de RLS-beleid:

**BELANGRIJK** : Voer het SQL-script uit in `lib/database/storage_receipts_rls_simple.sql`

Of kopieer-plak dit vereenvoudigde script:

```sql
-- Verwijder oude beleid als ze bestaan
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;

-- Beleid : Sta alle geverifieerde gebruikers toe om te uploaden naar receipts
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.role() = 'authenticated'
);

-- Beleid : Sta gebruikers toe om bestanden te bekijken die hun order_id bevatten
CREATE POLICY "Users can view their receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE name LIKE '%' || orders.id::text || '%'
    AND orders.user_id = auth.uid()
  )
);

-- Beleid : Sta admins toe om alle bewijzen te bekijken
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

### 4. Database update

Voer het volgende SQL-script uit in de Supabase SQL-editor:

```sql
-- Kolommen toevoegen voor het overschrijvingsbewijs
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS receipt_file_name TEXT;
```

Of voer het bestand uit: `lib/database/add_receipt_fields.sql`

## 📧 Te configureren bankgegevens

Wijzig de bankgegevens in `app/checkout/page.tsx` (regels ~240-260):

```tsx
<p className="text-lg font-semibold text-brown-dark">HER ESSENCE B.V.</p>
<p className="text-lg font-mono text-brown-dark">NL91 ABNA 0417 1643 00</p> // Uw IBAN
<p className="text-lg font-mono text-brown-dark">ABNANL2A</p> // Uw BIC
<p className="text-lg text-brown-dark">ABN AMRO Bank N.V.</p> // Uw bank
```

## 🔄 Werkstroom

### Klantzijde:

1. **Afrekenen** : De klant vult zijn gegevens in en ziet de overschrijvingsinstructies
2. **Bestelling aangemaakt** : De bestelling wordt aangemaakt met status `pending`
3. **Overschrijving uitgevoerd** : De klant voert de bankoverschrijving uit
4. **Uploaden** : De klant uploadt het bewijs naar `/televerser-recu`
5. **Status bijgewerkt** : De status verandert naar `processing` en er wordt een e-mail verzonden naar de admin

### Adminzijde:

1. **E-mail ontvangen** : De admin ontvangt een e-mail met:
   - Bestelgegevens
   - Overschrijvingsbewijs (afbeelding)
   - Knoppen "Bevestigen" en "Afwijzen"

2. **Mogelijke acties**:
   - **Vanuit de e-mail** : Klik op "Bevestigen" of "Afwijzen" (vereist het geheime token)
   - **Vanuit het dashboard** : Ga naar `/admin` en gebruik de knoppen

3. **Bevestiging**:
   - Status verandert naar `processing` (bij bevestiging) of `cancelled` (bij afwijzing)
   - `payment_status` verandert naar `paid` (bij bevestiging) of `failed` (bij afwijzing)
   - Bevestiging/afwijzing e-mail verzonden naar de klant

## 🔒 Beveiliging

- Bewijzen worden opgeslagen in een **privé** Supabase bucket
- Bevestiging/afwijzing links vereisen een geheim token
- Alleen admins kunnen alle bewijzen zien
- Gebruikers kunnen alleen hun eigen bewijzen zien

## 🧪 Testen

1. Plaats een testbestelling
2. Upload een testbewijs (afbeelding of PDF)
3. Controleer of de e-mail bij de admin aankomt
4. Test de bevestiging vanuit de e-mail en vanuit het dashboard
5. Controleer of de klant de bevestigingsmail ontvangt

## 📝 Belangrijke opmerkingen

- Geüploade bestanden zijn beperkt tot **5MB**
- Ondersteunde formaten: JPG, PNG, WEBP, PDF
- De status `processing` betekent "wachten op validatie van het bewijs"
- Eenmaal bevestigd, blijft de status `processing` tot verzending
- Afgewezen bestellingen krijgen de status `cancelled`

## 🐛 Probleemoplossing

### De e-mail komt niet bij de admin aan
- Controleer `RESEND_API_KEY` en `ADMIN_EMAIL`
- Controleer de logs in het Resend dashboard
- Controleer of het domein geverifieerd is in Resend

### Uploaden mislukt
- Controleer of de bucket `receipts` bestaat in Supabase Storage
- Controleer de RLS-beleid van de bucket
- Controleer de bestandsgrootte (max 5MB)

### De knoppen in de e-mail werken niet
- Controleer `ADMIN_CONFIRMATION_TOKEN` in beide bestanden
- Controleer `NEXT_PUBLIC_SITE_URL` of `NEXT_PUBLIC_VERCEL_URL`


