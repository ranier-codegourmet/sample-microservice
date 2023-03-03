import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';
import * as path from 'path';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

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
    ClientsModule.registerAsync([
      {
        imports: [
          ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
            validationSchema: Joi.object({
              GRPC_URL: Joi.string().required(),
            }),
            validationOptions: {
              allowUnknown: true,
              abortEarly: true,
            },
          }),
        ],
        name: 'WALLET_PACKAGE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'main',
            protoPath: path.join(__dirname, '../../rpc/main.proto'),
            url: configService.get('GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
          validationSchema: Joi.object({
            AUTH_PRIVATE_KEY: Joi.string().required(),
            EXPIRES_IN: Joi.string().required(),
          }),
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get('AUTH_PRIVATE_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRES_IN'), algorithm: 'RS256' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
