'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { ItemWithCategory } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ItemCardProps {
  item: ItemWithCategory;
}

export function ItemCard({ item }: ItemCardProps) {
  const primaryUrl = `${process.env.NEXT_PUBLIC_IMAGE_API_PRIMARY}?id=${item.itemID}`;
  const fallbackUrl = `${process.env.NEXT_PUBLIC_IMAGE_API_FALLBACK}?image=${item.itemID}.png`;
  const placeholderUrl = 'https://placehold.co/160x160.png';

  const [imageUrl, setImageUrl] = useState(primaryUrl);

  useEffect(() => {
    setImageUrl(primaryUrl);
  }, [item.itemID, primaryUrl]);

  const handleError = () => {
    if (imageUrl === primaryUrl) {
      setImageUrl(fallbackUrl);
    } else {
      setImageUrl(placeholderUrl);
    }
  };
  
  const aiHint = item.description ? item.description.split(' ').slice(0, 2).join(' ').toLowerCase() : 'item icon';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 group bg-card border-border">
          <CardContent className="relative p-0 aspect-square flex items-center justify-center bg-zinc-800/50">
            <Image
              src={imageUrl}
              alt={item.description || 'Free Fire Item'}
              width={150}
              height={150}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              data-ai-hint={aiHint}
              onError={handleError}
            />
            <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-sm py-0.5 text-center">
              <p className="text-white/90 text-[10px] font-semibold tracking-wider select-none">linktr.ee/FreeFireInt</p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative w-40 h-40 rounded-lg bg-zinc-800/50 flex items-center justify-center p-2">
              <Image
                src={imageUrl}
                alt={item.description || 'Free Fire Item'}
                width={160}
                height={160}
                className="object-contain"
                onError={handleError}
              />
              <div className="absolute bottom-2 left-2 right-2 w-auto bg-black/40 backdrop-blur-sm py-0.5 text-center rounded-md">
                <p className="text-white/90 text-[10px] font-semibold tracking-wider select-none">linktr.ee/FreeFireInt</p>
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-headline">{item.description}</DialogTitle>
          <div className="flex justify-center pt-2">
             <Badge variant="secondary">{item.category}</Badge>
          </div>
        </DialogHeader>
        <div className="py-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">{item.description2}</p>
            <p className="text-xs text-muted-foreground/50">ID: {item.itemID}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
