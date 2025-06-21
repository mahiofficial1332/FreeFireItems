import { cache } from 'react';
import { categorizeIcons } from '@/ai/flows/categorize-icons';
import type { FreeFireItem, ItemWithCategory } from '@/lib/types';

const URLS = [
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconDataOB47.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/FFiconData46.json',
  'https://raw.githubusercontent.com/iamaanahmad/FreeFireItems/refs/heads/main/IconData.json',
];

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

    const itemsToCategorize = uniqueItems.map(({ itemID, description, description2, icon }) => ({
      itemID,
      description: description || '',
      description2: description2 || '',
      icon: icon || '',
    }));

    // Categorize items in batches to avoid exceeding context window limits
    const BATCH_SIZE = 50;
    const batches = [];
    for (let i = 0; i < itemsToCategorize.length; i += BATCH_SIZE) {
        batches.push(itemsToCategorize.slice(i, i + BATCH_SIZE));
    }

    // Process batches sequentially with a delay to respect API rate limits (15 requests/minute)
    const categorizedData = [];
    for (const batch of batches) {
        const result = await categorizeIcons(batch);
        if (result) {
            categorizedData.push(...result);
        }
        // Wait for 5 seconds to stay under the 15 requests/minute limit
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

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
});