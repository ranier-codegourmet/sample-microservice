import { Item } from '../schema/item.schema';

export enum EItemStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
}

export type ICreateItem = {
  name: string;
  price: number;
  bid_time: number;
  user_id: string;
  status?: EItemStatus;
};

export type ICurrentItemBid = Partial<Item> & {
  current_bid_amount: number;
};
