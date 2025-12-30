'use client';

import { useEffect } from 'react';
import { products, categories } from '@/lib/data';

interface ProductStructuredDataProps {
  productId: string;
  reviews?: any[];
}

export default function ProductStructuredData({ productId, reviews = [] }: ProductStructuredDataProps) {
  useEffect(() => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const category = categories.find(c => c.slug === product.category);
    const images = product.images || [product.image];
    const baseUrl = 'https://essencefeminine.nl';

    // Calculer la note moyenne
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating || 0;

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.longDescription || product.description,
      image: images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
      sku: product.id,
      mpn: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'Essence Féminine',
      },
      category: category?.name || product.category,
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/produit/${product.id}`,
        priceCurrency: 'EUR',
        price: product.price.toString(),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Essence Féminine',
        },
        ...(product.originalPrice && {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: product.price.toString(),
            priceCurrency: 'EUR',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
              value: 1,
              unitCode: 'C62',
            },
          },
        }),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toString(),
        reviewCount: reviews.length > 0 ? reviews.length.toString() : (product.reviewsCount?.toString() || '0'),
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: `${review.profiles?.first_name || 'Utilisateur'} ${review.profiles?.last_name || ''}`.trim() || 'Client',
        },
        datePublished: review.created_at,
        reviewBody: review.comment || '',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      })),
      ...(product.originalPrice && {
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'discount',
            value: Math.round((1 - product.price / product.originalPrice) * 100).toString(),
          },
        ],
      }),
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
          name: category?.name || product.category,
          item: `${baseUrl}/categorie/${product.category}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `${baseUrl}/produit/${product.id}`,
        },
      ],
    };

    // Ajouter les scripts
    const productScript = document.createElement('script');
    productScript.type = 'application/ld+json';
    productScript.id = 'product-structured-data';
    productScript.textContent = JSON.stringify(productSchema);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-structured-data';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    // Supprimer les anciens scripts s'ils existent
    const oldProductScript = document.getElementById('product-structured-data');
    const oldBreadcrumbScript = document.getElementById('breadcrumb-structured-data');
    if (oldProductScript) oldProductScript.remove();
    if (oldBreadcrumbScript) oldBreadcrumbScript.remove();

    // Ajouter les nouveaux scripts
    document.head.appendChild(productScript);
    document.head.appendChild(breadcrumbScript);

    return () => {
      if (productScript.parentNode) productScript.parentNode.removeChild(productScript);
      if (breadcrumbScript.parentNode) breadcrumbScript.parentNode.removeChild(breadcrumbScript);
    };
  }, [productId, reviews]);

  return null;
}











