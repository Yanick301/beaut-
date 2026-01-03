# Structure du Projet Essence Féminine

## 📁 Architecture

```
Essence Féminine/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Page d'accueil
│   ├── layout.tsx                # Layout principal
│   ├── globals.css               # Styles globaux
│   ├── not-found.tsx             # Page 404
│   ├── a-propos/                 # Page À propos
│   ├── categorie/[slug]/         # Pages catégories
│   ├── produit/[id]/             # Pages produits
│   ├── panier/                   # Panier
│   ├── checkout/                 # Checkout
│   ├── commande-confirmee/       # Confirmation de commande
│   ├── compte/                   # Compte client
│   ├── contact/                  # Contact
│   ├── faq/                      # FAQ
│   ├── livraison-retours/        # Livraison & retours
│   ├── cgv/                      # Conditions générales
│   ├── confidentialite/          # Politique de confidentialité (RGPD)
│   └── mentions-legales/         # Mentions légales
│
├── components/                   # Composants réutilisables
│   ├── Header.tsx                # En-tête avec navigation
│   ├── Footer.tsx                # Pied de page
│   ├── ProductCard.tsx           # Carte produit
│   └── CategoryCard.tsx          # Carte catégorie
│
├── lib/                          # Utilitaires
│   ├── store.ts                  # Store Zustand (panier)
│   └── data.ts                   # Données produits et catégories
│
├── types/                        # Types TypeScript
│   └── index.ts                  # Définitions de types
│
└── Configuration files...

```

## 🎨 Design System

### Couleurs
- **beige-light**: #FAF7F2
- **beige**: #F5F1EB
- **nude**: #E8DDD4
- **rose-powder**: #F4E6E0
- **rose-soft**: #E8C5B8
- **gold**: #D4AF37
- **white-cream**: #FFFEF9
- **brown-soft**: #8B7355
- **brown-dark**: #5A4A3A

### Typographie
- **Titres**: Playfair Display (elegant)
- **Textes**: Inter (sans)

## 🚀 Fonctionnalités

### ✅ Implémentées
- [x] Page d'accueil complète (hero, catégories, best-sellers, preuve sociale)
- [x] Navigation complète avec menu mobile
- [x] Pages catégories avec filtres (prix, marque, tri)
- [x] Pages produits détaillées avec galerie, avis, produits similaires
- [x] Système de panier (ajout, suppression, quantité)
- [x] Checkout avec formulaire complet
- [x] Toutes les pages légales (CGV, RGPD, Mentions légales)
- [x] Page FAQ interactive
- [x] Page Contact avec formulaire
- [x] Page À propos
- [x] Page Livraison & Retours
- [x] Compte client (structure)
- [x] Design responsive
- [x] Page 404 personnalisée

### 📋 À compléter (intégration backend)
- [ ] Authentification utilisateur
- [ ] Gestion des commandes (backend)
- [ ] Paiement réel (intégration iDEAL, Stripe, PayPal)
- [ ] Base de données produits
- [ ] Newsletter
- [ ] Système d'avis clients (backend)
- [ ] Gestion des stocks
- [ ] Analytics et tracking

## 🌐 Routes

- `/` - Page d'accueil
- `/categorie/[slug]` - Liste produits par catégorie
- `/produit/[id]` - Détail produit
- `/panier` - Panier
- `/checkout` - Finalisation commande
- `/commande-confirmee` - Confirmation
- `/compte` - Compte client
- `/a-propos` - À propos
- `/contact` - Contact
- `/faq` - FAQ
- `/livraison-retours` - Livraison & retours
- `/cgv` - Conditions générales
- `/confidentialite` - Politique de confidentialité
- `/mentions-legales` - Mentions légales

## 📦 Installation

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## 🔧 Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **React Icons**

## 📝 Notes

- Le projet utilise des données mockées dans `lib/data.ts`
- Les images sont hébergées sur Unsplash (à remplacer par vos images)
- Le paiement est simulé (nécessite intégration réelle)
- Les avis clients sont mockés (nécessite backend)

