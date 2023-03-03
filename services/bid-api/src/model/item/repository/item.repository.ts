import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeStreamUpdateDocument } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { fromEvent, Observable } from 'rxjs';

import { EItemStatus } from '../interface/item.interface';
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

  public async findAll(filter: FilterQuery<Item>): Promise<Item[]> {
    return this.itemModel.find(filter);
  }

  public streamCompletedItems(): Observable<ChangeStreamUpdateDocument<Item>> {
    const watch = this.itemModel.watch(
      [
        {
          $match: {
            $or: [
              {
                operationType: 'update',
              },
              {
                staus: EItemStatus.COMPLETED,
              },
            ],
          },
        },
      ],
      {
        fullDocument: 'updateLookup',
      },
    );

    watch.on('change', () => {
      /**
       * rxjs cannot listen to this event
       * if I don't have this in listener
       */
    });

    return fromEvent(watch, 'change') as unknown as Observable<ChangeStreamUpdateDocument<Item>>;
  }
}
