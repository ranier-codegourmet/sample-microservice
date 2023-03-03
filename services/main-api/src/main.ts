import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'main',
      protoPath: path.join(__dirname, './proto/main.proto'),
      url: configService.get('GRPC_URL'),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  app.enableCors();

  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'));

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
