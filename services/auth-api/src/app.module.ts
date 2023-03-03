import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AuthModule } from './model/auth/auth.module';
import { MongoModule } from './providers/database/mongo.module';

@Module({
  imports: [
    MongoModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
