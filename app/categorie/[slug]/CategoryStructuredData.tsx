'use client';

import { useEffect } from 'react';
import { categories, products } from '@/lib/data';

interface CategoryStructuredDataProps {
  slug: string;
}

export default function CategoryStructuredData({ slug }: CategoryStructuredDataProps) {
  useEffect(() => {
    const category = categories.find(c => c.slug === slug);
    if (!category) return;

    const categoryProducts = products.filter(p => p.category === slug);
    const baseUrl = 'https://essencefeminine.nl';

    const collectionPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.description || `Collection de produits ${category.name.toLowerCase()}`,
      url: `${baseUrl}/categorie/${slug}`,
      image: category.image?.startsWith('http') ? category.image : `${baseUrl}${category.image}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: categoryProducts.length,
        itemListElement: categoryProducts.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            url: `${baseUrl}/produit/${product.id}`,
            image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
            offers: {
              '@type': 'Offer',
              price: product.price.toString(),
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
          },
        })),
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: `${baseUrl}/categorie/${slug}`,
        },
      ],
    };

    // Ajouter les scripts
    const collectionScript = document.createElement('script');
    collectionScript.type = 'application/ld+json';
    collectionScript.id = 'collection-structured-data';
    collectionScript.textContent = JSON.stringify(collectionPageSchema);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-structured-data';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    // Supprimer les anciens scripts s'ils existent
    const oldCollectionScript = document.getElementById('collection-structured-data');
    const oldBreadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (oldCollectionScript) oldCollectionScript.remove();
    if (oldBreadcrumbScript) oldBreadcrumbScript.remove();

    // Ajouter les nouveaux scripts
    document.head.appendChild(collectionScript);
    document.head.appendChild(breadcrumbScript);

    return () => {
      if (collectionScript.parentNode) collectionScript.parentNode.removeChild(collectionScript);
      if (breadcrumbScript.parentNode) breadcrumbScript.parentNode.removeChild(breadcrumbScript);
    };
  }, [slug]);

  return null;
}











