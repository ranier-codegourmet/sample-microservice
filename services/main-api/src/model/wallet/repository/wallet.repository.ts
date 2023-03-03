import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Wallet, WalletDocument } from '../schema/wallet.schema';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  public async findById(walletId: string): Promise<Wallet | null> {
    return this.walletModel.findById(walletId);
  }

  public async findOne(filter: FilterQuery<Wallet>): Promise<Wallet | null> {
    return this.walletModel.findOne(filter);
  }

  public async createWallet(payload: Partial<Wallet>): Promise<Wallet> {
    return this.walletModel.create(payload);
  }

  public async updateByOne(filter: FilterQuery<Wallet>, payload: Partial<Wallet>): Promise<Wallet | null> {
    return this.walletModel.findOneAndUpdate(filter, payload, { new: true });
  }
}
