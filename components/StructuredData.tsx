/**
 * Composant pour ajouter les données structurées JSON-LD pour le SEO
 */

interface StructuredDataProps {
  type?: 'Organization' | 'Product' | 'BreadcrumbList' | 'CollectionPage' | 'WebSite';
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
          url: 'https://essencefeminine.be',
          logo: 'https://essencefeminine.be/logo.png',
          description: 'E-commerce de produits de beauté premium pour femmes en Belgique',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Avenue Louise 123',
            addressLocality: 'Bruxelles',
            postalCode: '1050',
            addressCountry: 'BE',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contact@essencefeminine.be',
            availableLanguage: ['French', 'Dutch', 'English'],
          },
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
          itemListElement: data.itemListElement || data,
        };
      case 'CollectionPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          ...data,
        };
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Essence Féminine',
          url: 'https://essencefeminine.be',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://essencefeminine.be/recherche?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
          ...data,
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








