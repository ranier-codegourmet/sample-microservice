import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket/socket.adapter';

async function bootstrap() {
  const logger: Logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisIoAdapter = new SocketIOAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

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
