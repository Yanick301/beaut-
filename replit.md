# Her Essence - Premium Beauty E-commerce

## Overview

Her Essence is a premium beauty e-commerce platform targeting women in the Netherlands. It's a full-featured online store selling skincare, makeup, body care, hair products, fragrances, and beauty accessories. The platform includes user authentication, shopping cart, order management, favorites, reviews, newsletter subscription, and an admin dashboard for order management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router for server-side rendering and file-based routing
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design tokens (beige, rose, gold color palette)
- **Fonts**: Playfair Display (elegant headings) and Inter (body text) via next/font
- **State Management**: Zustand for client-side state (cart, toasts)
- **Components**: Modular React components in `/components` directory

### Backend Architecture
- **API Routes**: Next.js API routes in `/app/api` for server-side logic
- **Authentication**: Supabase Auth with email/password and magic links
- **Database**: Supabase (PostgreSQL) with Row Level Security policies
- **Admin Access**: Controlled via `ADMIN_EMAILS` environment variable or `is_admin` database column

### Data Layer
- **Product Data**: Static product catalog in `/lib/data.ts` (500+ products)
- **User Data**: Supabase tables for profiles, orders, favorites, reviews
- **Cart Persistence**: Zustand with localStorage persistence

### Key Design Patterns
- Server Components by default, Client Components only when needed ('use client')
- Middleware for route protection and auth session management
- Centralized Supabase client creation (separate server/client versions)
- Toast notifications via Zustand store
- Promo code validation system in `/lib/promo-codes.ts`

### Page Structure
- `/` - Homepage with featured products and categories
- `/categorie/[slug]` - Category pages with product listings
- `/produit/[id]` - Individual product pages with reviews
- `/panier` - Shopping cart
- `/checkout` - Checkout process
- `/compte` - User account (protected)
- `/admin` - Admin dashboard (protected, admin only)

## External Dependencies

### Core Services
- **Supabase**: Backend-as-a-Service for database, authentication, and file storage
  - Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - Storage bucket for payment receipts
  
- **Resend**: Email delivery service for order confirmations and notifications
  - Environment variables: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

- **Smartsupp**: Live chat widget for customer support (embedded script)

### Key NPM Packages
- `@supabase/ssr` and `@supabase/supabase-js` - Supabase integration
- `next-intl` - Internationalization (Dutch/French content)
- `react-icons` - Icon library
- `resend` - Email API client
- `zustand` - State management

### Environment Configuration
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-side only)
- `ADMIN_EMAILS` - Comma-separated list of admin email addresses
- `RESEND_API_KEY` - Resend API key for emails
- `ADMIN_EMAIL` - Email to receive admin notifications
- `NEXT_PUBLIC_SITE_URL` - Production site URL