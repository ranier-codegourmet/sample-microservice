import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { PendingBalance, PendingBalanceDocument } from '../schema/pendingBalance.schema';

@Injectable()
export class PendingBalanceRepository {
  constructor(
    @InjectModel(PendingBalance.name)
    private pendingBalanceModel: Model<PendingBalanceDocument>,
  ) {}

  public async findOne(filter: FilterQuery<PendingBalance>): Promise<PendingBalance | null> {
    return this.pendingBalanceModel.findOne(filter).lean();
  }

  public async getSumOfPendingBalanceExludeItemId(walletId: string, itemId: string): Promise<number> {
    const [pendingBalance] = await this.pendingBalanceModel.aggregate([
      {
        $match: {
          wallet_id: walletId,
          item_id: { $ne: itemId },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
        },
      },
    ]);

    return pendingBalance?.total || 0;
  }

  public async findOneAndUpdate(
    filter: FilterQuery<PendingBalance>,
    payload: UpdateQuery<PendingBalance>,
  ): Promise<PendingBalance> {
    return this.pendingBalanceModel.findOneAndUpdate(filter, payload, { new: true, upsert: true }).lean();
  }

  public async deleteOne(filter: FilterQuery<PendingBalance>): Promise<PendingBalance | null> {
    return this.pendingBalanceModel.findOneAndDelete(filter).lean();
  }
}
