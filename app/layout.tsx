import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ToastContainer from '@/components/ToastContainer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://essencefeminine.nl'),
  title: {
    default: 'Essence Féminine - Beauté Premium & Cosmétiques de Luxe',
    template: '%s | Essence Féminine'
  },
  description: 'Découvrez notre sélection de produits de beauté premium pour femmes. Soins du visage, maquillage, parfums et accessoires beauté de qualité. Livraison rapide aux Pays-Bas.',
  keywords: ['beauté', 'cosmétiques', 'soins visage', 'maquillage', 'parfums', 'Pays-Bas', 'e-commerce beauté', 'produits beauté premium', 'soins du corps', 'cheveux', 'accessoires beauté'],
  authors: [{ name: 'Essence Féminine' }],
  creator: 'Essence Féminine',
  publisher: 'Essence Féminine B.V.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://essencefeminine.nl',
    siteName: 'Essence Féminine',
    title: 'Essence Féminine - Beauté Premium & Cosmétiques de Luxe',
    description: 'Découvrez notre sélection de produits de beauté premium pour femmes. Soins du visage, maquillage, parfums et accessoires beauté de qualité.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Essence Féminine - Beauté Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essence Féminine - Beauté Premium & Cosmétiques de Luxe',
    description: 'Découvrez notre sélection de produits de beauté premium pour femmes.',
    images: ['/og-image.jpg'],
    creator: '@essencefeminine',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://essencefeminine.nl',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#FAF7F2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-beige-light font-sans antialiased">
        <StructuredData type="Organization" data={{}} />
        <StructuredData type="WebSite" data={{}} />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  )
}

