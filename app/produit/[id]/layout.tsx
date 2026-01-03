import { Metadata } from 'next';
import { products, categories } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  const category = categories.find(c => c.slug === product?.category);

  if (!product) {
    return {
      title: 'Product niet gevonden',
      description: 'Het product dat u zoekt bestaat niet.'
    };
  }

  const title = `${product.name} | Her Essence`;
  const description = product.longDescription || product.description || `Ontdek ${product.name}, een premium beautyproduct uit de categorie ${category?.name || product.category}. ${product.rating ? `Beoordeling: ${product.rating}/5.` : ''} Gratis verzending vanaf €150.`;
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
      'schoonheid',
      'cosmetica',
      'beautyproducten',
      'verzorging',
      'make-up',
      'Nederland',
      'e-commerce beauty',
    ].filter(Boolean),
    authors: [{ name: 'Her Essence' }],
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://heressence.nl/produit/${id}`,
      siteName: 'Her Essence',
      images: images.map(img => ({
        url: img.startsWith('http') ? img : `https://heressence.nl${img}`,
        width: 1200,
        height: 1200,
        alt: product.name,
      })),
      locale: 'nl_NL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.startsWith('http') ? img : `https://heressence.nl${img}`),
    },
    alternates: {
      canonical: `https://heressence.nl/produit/${id}`,
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

