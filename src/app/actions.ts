'use server';

import { categorizeIcons } from '@/ai/flows/categorize-icons';
import type { FreeFireItem, ItemWithCategory } from '@/lib/types';

const URLS = [
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconDataOB47.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconData46.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/IconData.json',
];

export async function getInitialData(): Promise<{ items: ItemWithCategory[], categories: string[] }> {
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

    const itemsToCategorize = uniqueItems.map(({ itemID, description, description2, icon }) => ({
      itemID,
      description: description || '',
      description2: description2 || '',
      icon: icon || '',
    }));

    // Categorize items in batches to avoid exceeding context window limits
    const BATCH_SIZE = 100;
    const batches = [];
    for (let i = 0; i < itemsToCategorize.length; i += BATCH_SIZE) {
        batches.push(itemsToCategorize.slice(i, i + BATCH_SIZE));
    }

    const categorizedBatches = await Promise.all(batches.map(batch => categorizeIcons(batch)));
    const categorizedData = categorizedBatches.filter(Boolean).flat();

    const categoryMap = new Map(categorizedData.map(c => [c.itemID, c.category]));
    
    const itemsWithCategory: ItemWithCategory[] = uniqueItems.map(item => ({
      ...item,
      category: categoryMap.get(item.itemID) || 'Other',
    }));

    const allCategories = [...new Set(itemsWithCategory.map(item => item.category))];

    return { items: itemsWithCategory, categories: allCategories.sort() };
  } catch (error) {
    console.error("Error fetching or processing initial data:", error);
    return { items: [], categories: [] };
  }
}
