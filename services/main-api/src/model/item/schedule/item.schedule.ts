import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ItemService } from '../item.service';

@Injectable()
export class ItemSchedule {
  constructor(private readonly itemService: ItemService) {}

  @Cron('*/10 * * * * *')
  async updateItemStatus() {
    await this.itemService.updateCompletedItems();
  }
}
