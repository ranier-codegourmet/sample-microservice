import { Bid } from '../schema/bid.schema';

export type BidQueueRequest = {
  item_id: string;
  price: number;
  user_id: string;
};

export type EmitBidStatus = {
  item_id: string;
  item_name: string;
  user_id: string;
  status: number;
  message: string;
};

export type UserBid = Pick<Bid, 'price'> & {
  name: string;
  user_id: string;
  sold: boolean;
};

export type EmitBidList = {
  item_id: string;
  list: UserBid[];
};
