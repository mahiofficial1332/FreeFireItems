'use client';

import type { ItemWithCategory } from '@/lib/types';
import { ItemCard } from './item-card';
import { AdSenseSlot } from './adsense-slot';

interface ItemGridProps {
  items: ItemWithCategory[];
}

const AD_INTERVAL = 8;

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <p className="text-xl font-medium">No items found.</p>
        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const gridItems: React.ReactNode[] = [];
  for (let i = 0; i < items.length; i++) {
    gridItems.push(<ItemCard key={items[i].itemID} item={items[i]} />);
    if ((i + 1) % AD_INTERVAL === 0 && (i + 1) < items.length) {
      gridItems.push(<AdSenseSlot key={`ad-${i}`} />);
    }
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
      {gridItems}
    </div>
  );
}
