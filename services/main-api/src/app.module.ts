import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';

import { ItemModule } from './model/item/item.module';
import { WalletModule } from './model/wallet/wallet.module';
import { MongoModule } from './provider/database/mongo.module';

@Module({
  imports: [
    MongoModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GRPC_URL: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PassportModule,
    WalletModule,
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
