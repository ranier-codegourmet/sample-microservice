import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Item, ItemDocument } from '../../src/model/item/schema/item.schema';
import { Wallet, WalletDocument } from '../../src/model/wallet/schema/wallet.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  public async createItem(payload: Partial<Item>): Promise<Item> {
    return this.itemModel.create(payload);
  }

  public async createWallet(payload: Partial<Wallet>): Promise<Wallet> {
    return this.walletModel.create(payload);
  }

  public async clearDatabase(): Promise<void> {
    await this.itemModel.deleteMany({});
    await this.walletModel.deleteMany({});
  }
}
