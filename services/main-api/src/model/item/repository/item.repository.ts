import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { ICurrentItemBid } from '../interface/item.interface';
import { Item, ItemDocument } from '../schema/item.schema';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
  ) {}

  public async findById(itemId: string): Promise<Item | null> {
    return this.itemModel.findById(itemId);
  }

  public async findAll(filter: FilterQuery<Item>, sort?: any): Promise<Item[]> {
    const data = this.itemModel.find(filter);

    if (sort) {
      return data.sort(sort);
    }

    return data;
  }

  public async findCurrentItemBid(itemId: string): Promise<ICurrentItemBid[]> {
    return this.itemModel.aggregate([
      {
        $match: {
          _id: new ObjectId(itemId),
        },
      },
      {
        $addFields: {
          itemStringId: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'bids',
          let: { itemId: '$itemStringId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$item_id', '$$itemId'] }],
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: 'current_bid',
        },
      },
      {
        $project: {
          current_bid_amount: { $sum: '$current_bid.price' },
          name: 1,
          price: 1,
          status: 1,
          time_window: 1,
        },
      },
    ]);
  }

  public async createItem(payload: Partial<Item>): Promise<Item> {
    return this.itemModel.create(payload);
  }

  public async updateByOne(filter: FilterQuery<Item>, payload: Partial<Item>): Promise<Item | null> {
    return this.itemModel.findByIdAndUpdate(filter, payload, { new: true });
  }

  public async updateMany(filter: FilterQuery<Item>, payload: UpdateQuery<Item>): Promise<Item[]> {
    return this.itemModel.updateMany(filter, payload).lean();
  }
}
