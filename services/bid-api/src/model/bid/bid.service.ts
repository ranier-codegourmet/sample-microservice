import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { ItemService } from '../item/item.service';
import { WalletService } from '../wallet/wallet.service';
import { UserBid } from './interface/bid.interface';
import { BidRepository } from './repository/bid.repository';
import { Bid } from './schema/bid.schema';
import { BidGateway } from './socket/bid.gateway';

@Injectable()
export class BidService {
  constructor(
    private readonly bidRepository: BidRepository,
    private readonly itemService: ItemService,
    private readonly bidGateway: BidGateway,
    private readonly walletService: WalletService,
  ) {}

  public async verifyBid(payload: Partial<Bid>): Promise<void> {
    const { user_id, item_id } = payload;
    const item = await this.itemService.findItemById(item_id);

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    if (item.status === 'draft') {
      throw new BadRequestException('Item is not published');
    }

    if (DateTime.now() > DateTime.fromJSDate(item.time_window)) {
      throw new BadRequestException('Item is already closed');
    }

    if (item.price >= payload.price) {
      throw new BadRequestException('Bid price must be higher than the item price');
    }

    const [lastBid] = await this.bidRepository.findLastBidByItemId(item_id);

    if (lastBid && lastBid.price >= payload.price) {
      throw new BadRequestException('Bid price must be higher than the last bid');
    }

    const [lastUserBid] = await this.bidRepository.findLastBidByUserIdAndItemId(user_id, item_id);

    if (lastUserBid) {
      const diff = DateTime.now().diff(DateTime.fromJSDate(lastUserBid.createdAt)).toObject();

      if (diff.milliseconds < 5000) {
        throw new BadRequestException('You can only bid once every 5 seconds');
      }
    }

    await this.walletService.verifyWalletBalance(user_id, String(item._id), payload.price);
  }

  public async createBid(payload: Partial<Bid>): Promise<Bid | void> {
    const { user_id, item_id } = payload;
    const item = await this.itemService.findItemById(item_id);

    if (!item) {
      return this.bidGateway.bidStatus({
        user_id: user_id,
        item_name: item.name,
        status: 404,
        message: 'Item not found',
        item_id: item_id,
      });
    }

    if (item.status === 'draft') {
      return this.bidGateway.bidStatus({
        user_id: user_id,
        status: 400,
        message: 'Item is not published',
        item_id: item_id,
        item_name: item.name,
      });
    }

    if (DateTime.now() > DateTime.fromJSDate(item.time_window)) {
      return this.bidGateway.bidStatus({
        user_id: user_id,
        status: 400,
        message: 'Item is already closed',
        item_id: item_id,
        item_name: item.name,
      });
    }

    const [lastBid] = await this.bidRepository.findLastBidByItemId(item_id);

    if (lastBid && lastBid.price >= payload.price) {
      return this.bidGateway.bidStatus({
        user_id: user_id,
        status: 400,
        message: 'Bid price must be higher than the last bid',
        item_id: item_id,
        item_name: item.name,
      });
    }

    const [lastUserBid] = await this.bidRepository.findLastBidByUserIdAndItemId(user_id, item_id);

    if (lastUserBid) {
      const diff = DateTime.now().diff(DateTime.fromJSDate(lastUserBid.createdAt)).toObject();

      if (diff.milliseconds < 5000) {
        return this.bidGateway.bidStatus({
          user_id: user_id,
          status: 400,
          message: 'You can only bid once every 5 seconds',
          item_id: item_id,
          item_name: item.name,
        });
      }
    }

    const bid = await this.bidRepository.createBid(payload);
    const [bids] = await Promise.all([
      this.bidRepository.findAllBidByItemId(item_id),
      this.walletService.updatePendingBalance(user_id, String(item._id), payload.price),
    ]);

    this.bidGateway.bidStatus({
      user_id: user_id,
      status: 200,
      message: 'Bid created',
      item_id: item_id,
      item_name: item.name,
    });
    this.bidGateway.bidList({
      item_id: item_id,
      list: bids,
    });

    return bid;
  }

  public async getAllBidByItemId(item_id: string): Promise<UserBid[]> {
    return this.bidRepository.findAllBidByItemId(item_id);
  }

  public async updateBidWinner(): Promise<void> {
    await this.itemService.streamCompletedItems().subscribe(async (stream) => {
      const item = stream.fullDocument;

      const bid = await this.bidRepository.updateBidWinner(String(item._id));

      if (bid) {
        await this.walletService.updateBalanceFromPendingBalance(String(bid.user_id), String(item._id));
      }
    });
  }
}
