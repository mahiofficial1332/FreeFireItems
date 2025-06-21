export interface FreeFireItem {
  itemID: string;
  description: string;
  description2: string;
  icon: string;
}

export interface ItemWithCategory extends FreeFireItem {
  category: string;
}
