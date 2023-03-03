import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { UserBid } from '../interface/bid.interface';
import { Bid, BidDocument } from '../schema/bid.schema';

@Injectable()
export class BidRepository {
  constructor(
    @InjectModel(Bid.name)
    private bidModel: Model<BidDocument>,
  ) {}

  public async createBid(payload: Partial<Bid>): Promise<Bid> {
    return this.bidModel.create(payload);
  }

  public async findLastBidByItemId(itemId: string): Promise<Bid[]> {
    return this.bidModel.find({ item_id: itemId }).sort({ createdAt: -1 }).limit(1).lean();
  }

  public async findLastBidByUserIdAndItemId(userId: string, itemId: string): Promise<Bid[]> {
    return this.bidModel.find({ user_id: userId, item_id: itemId }).sort({ createdAt: -1 }).limit(1).lean();
  }

  public async findAllBidByItemId(itemId: string): Promise<UserBid[]> {
    return this.bidModel.aggregate([
      {
        $match: {
          item_id: itemId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $addFields: {
          userObjectId: { $toObjectId: '$user_id' },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userObjectId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$userId'] }],
                },
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user' },
      },
      {
        $project: {
          price: 1,
          name: '$user.name',
          user_id: '$user._id',
          sold: 1,
        },
      },
    ]);
  }

  public async updateMany(filter: FilterQuery<Bid>, payload: UpdateQuery<Bid>): Promise<Bid[]> {
    return this.bidModel.updateMany(filter, payload).lean();
  }

  public async updateBidWinner(itemId: string): Promise<Bid> {
    return this.bidModel.findOneAndUpdate(
      {
        item_id: itemId,
      },
      {
        $set: {
          sold: true,
        },
      },
      {
        new: true,
        sort: {
          createdAt: -1,
        },
      },
    );
  }
}
