import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categorie/${category.slug}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white-cream shadow-md hover:shadow-xl transition-all duration-300 h-64">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white-cream">
          <h3 className="font-elegant text-2xl mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-white-cream/90 mb-4 line-clamp-2">
              {category.description}
            </p>
          )}
          <span className="flex items-center gap-2 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Découvrir <FiArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}








