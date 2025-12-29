import { Metadata } from 'next';
import { categories, products } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.category === slug);

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
      description: 'La catégorie que vous recherchez n\'existe pas.',
    };
  }

  const title = `${category.name} | Essence Féminine`;
  const description = category.description || `Découvrez notre sélection de produits ${category.name.toLowerCase()}. ${categoryProducts.length} produits disponibles. Produits de beauté premium, livraison gratuite dès €50.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      ...(category.subCategories || []),
      'beauté',
      'cosmétiques',
      'produits beauté',
      'soins',
      'maquillage',
      'Pays-Bas',
      'e-commerce beauté',
    ],
    authors: [{ name: 'Essence Féminine' }],
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://essencefeminine.nl/categorie/${slug}`,
      siteName: 'Essence Féminine',
      images: [
        {
          url: category.image?.startsWith('http') ? category.image : `https://essencefeminine.nl${category.image}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image?.startsWith('http') ? category.image : `https://essencefeminine.nl${category.image}`],
    },
    alternates: {
      canonical: `https://essencefeminine.nl/categorie/${slug}`,
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





