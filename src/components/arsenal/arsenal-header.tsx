'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ArsenalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ArsenalHeader({ searchQuery, onSearchChange }: ArsenalHeaderProps) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
        FreeFire <span className="text-primary">Arsenal</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Your complete library for Free Fire item icons. Search and explore weapons, accessories, and more.
      </p>
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by ID, name, or description..."
          className="pl-10 h-12 text-base rounded-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}
