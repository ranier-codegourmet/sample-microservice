import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';

import { EItemStatus, ICreateItem, ICurrentItemBid } from './interface/item.interface';
import { ItemRepository } from './repository/item.repository';
import { Item } from './schema/item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  public async createItem(payload: ICreateItem): Promise<Item> {
    const start = DateTime.now().plus({ hours: payload.bid_time });

    const data: Partial<Item> = {
      ...payload,
      ...(payload.status === EItemStatus.PUBLISHED
        ? { time_window: new Date(start.toISO()) }
        : { time_window: new Date() }),
    };

    return this.itemRepository.createItem(data);
  }

  public async updateItemStatus(itemId: string, status: EItemStatus): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);

    if (!item) throw new NotFoundException('Item not found');

    if ([EItemStatus.PUBLISHED, EItemStatus.COMPLETED].includes(item.status as EItemStatus)) {
      throw new BadRequestException('Item is already published or completed');
    }

    const start = DateTime.now().plus({ hours: item.bid_time });

    const data: Partial<Item> = {
      time_window: status === EItemStatus.PUBLISHED ? new Date(start.toISO()) : new Date(),
      status,
    };

    return this.itemRepository.updateByOne({ _id: item._id }, data);
  }

  public async getAllOwnItem(userId: string): Promise<Item[]> {
    return this.itemRepository.findAll(
      {
        user_id: userId,
        status: EItemStatus.DRAFT,
      },
      {
        createdAt: -1,
      },
    );
  }

  public async getAllPublishedItem(): Promise<Item[]> {
    return this.itemRepository.findAll(
      {
        status: EItemStatus.PUBLISHED,
      },
      {
        createdAt: -1,
      },
    );
  }

  public async getAllCompletedItem(): Promise<Item[]> {
    return this.itemRepository.findAll(
      {
        status: EItemStatus.COMPLETED,
      },
      {
        createdAt: -1,
      },
    );
  }

  public async updateCompletedItems(): Promise<Item[]> {
    return this.itemRepository.updateMany(
      {
        status: EItemStatus.PUBLISHED,
        time_window: {
          $lte: new Date(),
        },
      },
      {
        $set: {
          status: EItemStatus.COMPLETED,
        },
      },
    );
  }

  public async getItemBid(itemId: string): Promise<ICurrentItemBid> {
    const [currentBid] = await this.itemRepository.findCurrentItemBid(itemId);

    return currentBid;
  }
}
