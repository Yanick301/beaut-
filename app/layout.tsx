import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PromoBanner from '@/components/PromoBanner'
import StructuredData from '@/components/StructuredData'
import ToastContainer from '@/components/ToastContainer'
import SmartsuppChat from '@/components/SmartsuppChat'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  icons: {
    icon: '/logo.png',
  },
  metadataBase: new URL('https://heressence.nl'),
  title: {
    default: 'Her Essence - Premium Beauty & Luxe Cosmetica',
    template: '%s | Her Essence'
  },
  description: 'Ontdek onze selectie premium beautyproducten voor vrouwen. Gezichtsverzorging, make-up, lichaamsgeuren en beautyaccessoires van hoge kwaliteit. Snelle levering in Nederland.',
  keywords: ['beauty', 'cosmetica', 'gezichtsverzorging', 'make-up', 'parfums', 'lichaamsgeuren', 'Nederland', 'e-commerce beauty', 'premium beautyproducten', 'lichaamsverzorging', 'haar', 'beautyaccessoires'],
  authors: [{ name: 'Her Essence' }],
  creator: 'Her Essence',
  publisher: 'Her Essence B.V.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://heressence.nl',
    siteName: 'Her Essence',
    title: 'Her Essence - Premium Beauty & Luxe Cosmetica',
    description: 'Ontdek onze selectie premium beautyproducten voor vrouwen. Gezichtsverzorging, make-up, lichaamsgeuren en beautyaccessoires van hoge kwaliteit.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Her Essence - Premium Beauty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Her Essence - Premium Beauty & Luxe Cosmetica',
    description: 'Ontdek onze selectie premium beautyproducten voor vrouwen.',
    images: ['/og-image.jpg'],
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
    canonical: 'https://heressence.nl',
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
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-beige-light font-sans antialiased">
        <StructuredData type="Organization" data={{}} />
        <StructuredData type="WebSite" data={{}} />
        <PromoBanner />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SmartsuppChat />
        <ToastContainer />
      </body>
    </html>
  )
}

