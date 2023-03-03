import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { JwtStrategy } from '../../auth/strategy/jwt.strategy';
import { WalletController } from './controller/wallet.controller';
import { WalletRepository } from './repository/wallet.repository';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { WalletService } from './wallet.service';

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
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletRepository,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class WalletModule {}
