'use client';

import Image from 'next/image';
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
  const cardPlaceholder = 'https://placehold.co/150x150.png';
  const dialogPlaceholder = 'https://placehold.co/128x128.png';

  const imageUrl = `https://freefireinfo.vercel.app/icon?id=${item.itemID}`;
  const dialogImageUrl = `https://freefireinfo.vercel.app/icon?id=${item.itemID}`;
  
  const aiHint = item.description ? item.description.split(' ').slice(0, 2).join(' ').toLowerCase() : 'item icon';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 group bg-card border-border">
          <CardContent className="p-0 aspect-square flex items-center justify-center bg-zinc-800/50">
            <Image
              src={imageUrl}
              alt={item.description || 'Free Fire Item'}
              width={150}
              height={150}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              data-ai-hint={aiHint}
              onError={(e) => { e.currentTarget.src = cardPlaceholder; e.currentTarget.srcset = '' }}
            />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-lg bg-zinc-800/50 flex items-center justify-center p-2">
              <Image
                src={dialogImageUrl}
                alt={item.description || 'Free Fire Item'}
                width={128}
                height={128}
                className="object-contain"
                onError={(e) => { e.currentTarget.src = dialogPlaceholder; e.currentTarget.srcset = '' }}
              />
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
