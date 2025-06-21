import { cache } from 'react';
import type { FreeFireItem, ItemWithCategory } from '@/lib/types';

const URLS = [
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconDataOB47.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconData46.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/IconData.json',
];

const getCategoryForItem = (item: FreeFireItem): string => {
  const description = (item.description || '').toLowerCase();
  const description2 = (item.description2 || '').toLowerCase();
  const combinedDescription = `${description} ${description2}`;

  if (combinedDescription.includes('weapon') || combinedDescription.includes('gun') || combinedDescription.includes('rifle') || combinedDescription.includes('pistol') || combinedDescription.includes('shotgun') || combinedDescription.includes('smg') || combinedDescription.includes('sniper') || combinedDescription.includes('melee')) {
    return 'Weapon';
  }
  if (combinedDescription.includes('helmet') || combinedDescription.includes('vest') || combinedDescription.includes('backpack') || combinedDescription.includes('scope') || combinedDescription.includes('armour') || combinedDescription.includes('gloo wall')) {
    return 'Accessory';
  }
  if (combinedDescription.includes('medkit') || combinedDescription.includes('mushroom') || combinedDescription.includes('inhaler') || combinedDescription.includes('revival')) {
    return 'Consumable';
  }
  return 'Other';
};


export const getInitialData = cache(async (): Promise<{ items: ItemWithCategory[], categories: string[] }> => {
  try {
    const responses = await Promise.all(URLS.map(url => fetch(url, { cache: 'no-store' })));
    const allJson = await Promise.all(responses.map(res => {
      if (!res.ok) {
        console.error(`Failed to fetch ${res.url}: ${res.statusText}`);
        return [];
      }
      return res.json();
    }));

    const allItems: FreeFireItem[] = allJson.flat();
    const uniqueItemsMap = new Map<string, FreeFireItem>();
    allItems.forEach(item => {
      if (item && item.itemID) {
        uniqueItemsMap.set(item.itemID, item);
      }
    });
    const uniqueItems = Array.from(uniqueItemsMap.values());

    const itemsWithCategory: ItemWithCategory[] = uniqueItems.map(item => ({
      ...item,
      category: getCategoryForItem(item),
    }));

    const allCategories = [...new Set(itemsWithCategory.map(item => item.category))];

    return { items: itemsWithCategory, categories: allCategories.sort() };
  } catch (error) {
    console.error("Error fetching or processing initial data:", error);
    return { items: [], categories: [] };
  }
});
