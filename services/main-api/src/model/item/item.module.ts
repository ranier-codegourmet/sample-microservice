import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { JwtStrategy } from '../../auth/strategy/jwt.strategy';
import { ItemController } from './controller/item.controller';
import { ItemService } from './item.service';
import { ItemRepository } from './repository/item.repository';
import { ItemSchedule } from './schedule/item.schedule';
import { Item, ItemSchema } from './schema/item.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
      validationSchema: Joi.object({
        AUTH_PUBLIC_KEY: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ItemController],
  providers: [
    ItemService,
    ItemRepository,
    ItemSchedule,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ItemModule {}
