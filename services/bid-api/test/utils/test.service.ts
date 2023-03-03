import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bid, BidDocument } from '../../src/model/bid/schema/bid.schema';
import { Item, ItemDocument } from '../../src/model/item/schema/item.schema';
import { Wallet, WalletDocument } from '../../src/model/wallet/schema/wallet.schema';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Bid.name)
    private readonly bidModel: Model<BidDocument>,
    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async createUser(payload: Partial<User>): Promise<User> {
    return this.userModel.create(payload);
  }

  public async createBid(payload: Partial<Bid>): Promise<Bid> {
    return this.bidModel.create(payload);
  }

  public async createItem(payload: Partial<Item>): Promise<Item> {
    return this.itemModel.create(payload);
  }

  public async createWallet(payload: Partial<Wallet>): Promise<Wallet> {
    return this.walletModel.create(payload);
  }

  public async clearDatabase(): Promise<void> {
    await this.bidModel.deleteMany({});
    await this.itemModel.deleteMany({});
    await this.walletModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
