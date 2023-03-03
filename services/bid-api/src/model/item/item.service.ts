import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ChangeStreamUpdateDocument } from 'mongodb';
import { Observable } from 'rxjs';

import { EItemStatus } from './interface/item.interface';
import { ItemRepository } from './repository/item.repository';
import { Item } from './schema/item.schema';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  public async verifyItem(itemId: string): Promise<Item | null> {
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.status !== EItemStatus.PUBLISHED) {
      throw new BadRequestException('Item is not published');
    }

    if (DateTime.now() > DateTime.fromJSDate(item.time_window)) {
      throw new BadRequestException('Item is already closed');
    }

    return item;
  }

  public async findItemById(itemId: string): Promise<Item | null> {
    return this.itemRepository.findById(itemId);
  }

  public streamCompletedItems(): Observable<ChangeStreamUpdateDocument<Item>> {
    return this.itemRepository.streamCompletedItems();
  }
}
