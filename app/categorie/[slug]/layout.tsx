import { Metadata } from 'next';
import { categories, products } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.category === slug);

  if (!category) {
    return {
      title: 'Categorie niet gevonden',
      description: 'De categorie die u zoekt bestaat niet.',
    };
  }

  const title = `${category.name} | Her Essence`;
  const description = category.description || `Ontdek onze selectie ${category.name.toLowerCase()} producten. ${categoryProducts.length} producten beschikbaar. Premium beautyproducten, gratis verzending vanaf €150.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      ...(category.subCategories || []),
      'schoonheid',
      'cosmetica',
      'beautyproducten',
      'verzorging',
      'make-up',
      'Nederland',
      'e-commerce beauty',
    ],
    authors: [{ name: 'Her Essence' }],
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://heressence.nl/categorie/${slug}`,
      siteName: 'Her Essence',
      images: [
        {
          url: category.image?.startsWith('http') ? category.image : `https://heressence.nl${category.image}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      locale: 'nl_NL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image?.startsWith('http') ? category.image : `https://heressence.nl${category.image}`],
    },
    alternates: {
      canonical: `https://heressence.nl/categorie/${slug}`,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}











