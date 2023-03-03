import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ItemService } from './item.service';
import { ItemRepository } from './repository/item.repository';
import { Item, ItemSchema } from './schema/item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }])],
  controllers: [],
  providers: [ItemRepository, ItemService],
  exports: [ItemService],
})
export class ItemModule {}
