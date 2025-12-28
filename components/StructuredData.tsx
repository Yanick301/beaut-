/**
 * Composant pour ajouter les données structurées JSON-LD pour le SEO
 */

interface StructuredDataProps {
  type?: 'Organization' | 'Product' | 'BreadcrumbList';
  data: any;
}

export default function StructuredData({ type = 'Organization', data }: StructuredDataProps) {
  const getSchema = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Essence Féminine',
          url: 'https://essencefeminine.nl',
          logo: 'https://essencefeminine.nl/logo.png',
          description: 'E-commerce de produits de beauté premium pour femmes',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Amsterdam',
            addressCountry: 'NL',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+31-20-123-4567',
            contactType: 'customer service',
            email: 'contact@essencefeminine.nl',
            availableLanguage: ['French', 'Dutch', 'English'],
          },
          sameAs: [
            'https://www.facebook.com/essencefeminine',
            'https://www.instagram.com/essencefeminine',
          ],
        };
      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          ...data,
        };
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data,
        };
      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }}
    />
  );
}








