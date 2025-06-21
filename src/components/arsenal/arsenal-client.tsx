'use client';

import { useState, useMemo } from 'react';
import type { ItemWithCategory } from '@/lib/types';
import { ArsenalHeader } from './arsenal-header';
import { CategoryFilters } from './category-filters';
import { ItemGrid } from './item-grid';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

interface ArsenalClientProps {
  initialItems: ItemWithCategory[];
  allCategories: string[];
}

export function ArsenalClient({ initialItems, allCategories }: ArsenalClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const filteredItems = useMemo(() => {
    let items = initialItems;

    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.itemID.toLowerCase().includes(lowercasedQuery) ||
          (item.description && item.description.toLowerCase().includes(lowercasedQuery)) ||
          (item.description2 && item.description2.toLowerCase().includes(lowercasedQuery)) ||
          (item.icon && item.icon.toLowerCase().includes(lowercasedQuery))
      );
    }
    return items;
  }, [initialItems, searchQuery, selectedCategory]);

  const itemsToDisplay = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setLoading(false);
    }, 500);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(ITEMS_PER_PAGE); 
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ArsenalHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <CategoryFilters
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <ItemGrid items={itemsToDisplay} />
      {visibleCount < filteredItems.length && (
        <div className="mt-12 text-center">
          <Button onClick={handleLoadMore} size="lg" disabled={loading} className="bg-accent hover:bg-accent/90">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
