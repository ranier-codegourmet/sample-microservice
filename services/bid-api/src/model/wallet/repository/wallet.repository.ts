import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Wallet, WalletDocument } from '../schema/wallet.schema';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  public async findByUserId(userId: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ user_id: userId });
  }

  public async updateByOne(filter: FilterQuery<Wallet>, payload: UpdateQuery<Wallet>): Promise<Wallet | null> {
    return this.walletModel.findOneAndUpdate(filter, payload, { new: true });
  }
}
