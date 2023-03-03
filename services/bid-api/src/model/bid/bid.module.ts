import { BullModule } from '@nestjs/bull';
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';

import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { JwtStrategy } from '../../auth/strategy/jwt.strategy';
import { ItemModule } from '../item/item.module';
import { WalletModule } from '../wallet/wallet.module';
import { BidService } from './bid.service';
import { BidController } from './controller/bid.controller';
import { BidProcessor } from './processor/bid.processor';
import { BidRepository } from './repository/bid.repository';
import { Bid, BidSchema } from './schema/bid.schema';
import { BidGateway } from './socket/bid.gateway';

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
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    BullModule.registerQueueAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
          validationSchema: Joi.object({
            BID_QUEUE: Joi.string().required(),
            REDIS_HOST: Joi.string().required(),
            REDIS_PORT: Joi.number().required(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      name: 'bid',
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
          validationSchema: Joi.object({
            REDIS_HOST: Joi.string().required(),
            REDIS_PORT: Joi.number().required(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ItemModule,
    WalletModule,
  ],
  controllers: [BidController],
  providers: [
    BidRepository,
    BidService,
    BidProcessor,
    BidGateway,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class BidModule {}
