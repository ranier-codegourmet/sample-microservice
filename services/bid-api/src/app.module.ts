import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';

import { BidModule } from './model/bid/bid.module';
import { MongoModule } from './providers/database/mongo.module';

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
    BullModule.forRootAsync({
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
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BidModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
