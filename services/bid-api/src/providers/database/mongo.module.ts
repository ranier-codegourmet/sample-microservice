import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
          validationSchema: Joi.object({
            MONGO_URI: Joi.string().required(),
            MONGO_USER: Joi.string().optional(),
            MONGO_PASSWORD: Joi.string().optional(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
