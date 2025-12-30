import { Metadata } from 'next';
import { products, categories } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  const category = categories.find(c => c.slug === product?.category);

  if (!product) {
    return {
      title: 'Produit non trouvé',
      description: 'Le produit que vous recherchez n\'existe pas.',
    };
  }

  const title = `${product.name} | Essence Féminine`;
  const description = product.longDescription || product.description || `Découvrez ${product.name}, un produit de beauté premium de la catégorie ${category?.name || product.category}. ${product.rating ? `Note : ${product.rating}/5.` : ''} Livraison gratuite dès €150.`;
  const images = product.images || [product.image];
  const price = product.originalPrice || product.price;
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand || '',
      product.category,
      category?.name || '',
      'beauté',
      'cosmétiques',
      'produits beauté',
      'soins',
      'maquillage',
      'Belgique',
      'e-commerce beauté',
    ].filter(Boolean),
    authors: [{ name: 'Essence Féminine' }],
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://essencefeminine.be/produit/${id}`,
      siteName: 'Essence Féminine',
      images: images.map(img => ({
        url: img.startsWith('http') ? img : `https://essencefeminine.be${img}`,
        width: 1200,
        height: 1200,
        alt: product.name,
      })),
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.startsWith('http') ? img : `https://essencefeminine.nl${img}`),
    },
    alternates: {
      canonical: `https://essencefeminine.be/produit/${id}`,
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'EUR',
      'product:availability': 'in stock',
      'product:condition': 'new',
      ...(product.originalPrice && {
        'product:original_price:amount': product.originalPrice.toString(),
        'product:original_price:currency': 'EUR',
      }),
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

