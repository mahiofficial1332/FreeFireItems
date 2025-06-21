'use client';

import { Button } from '@/components/ui/button';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilters({ categories, selectedCategory, onSelectCategory }: CategoryFiltersProps) {
  const allCats = ['All', ...categories];

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
      {allCats.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'secondary'}
          onClick={() => onSelectCategory(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
