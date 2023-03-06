export enum EItemStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  COMPLETED = "completed",
}

export type IItem = {
  _id: string;
  name: string;
  price: number;
  time_window: string;
  status: EItemStatus;
  user_id: string;
};

export type ICurrentBidItem = IItem & {
  current_bid_amount: number;
};

export type IItemList = IItem[];
