import { getInitialData } from '@/app/actions';
import { ArsenalClient } from '@/components/arsenal/arsenal-client';

export default async function Home() {
  const { items, categories } = await getInitialData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ArsenalClient initialItems={items} allCategories={categories} />
    </main>
  );
}
