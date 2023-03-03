import { INestApplicationContext, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';

import { ISocket } from '../auth/interface/auth.interface';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger: Logger = new Logger(SocketIOAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const configService = this.app.get(ConfigService);

    const pubClient = createClient({ url: configService.get('REDIS_URL') });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);

    const jwtService = this.app.get(JwtService);
    const configService = this.app.get(ConfigService);

    server.of('bid').use((socket: ISocket, next) => {
      const token = socket.handshake?.headers?.authorization?.replace('Bearer ', '');
      // for Postman testing support, fallback to token header
      // const token = socket.handshake.auth.token || socket.handshake.headers['token'];

      if (!token) return next(new UnauthorizedException());

      try {
        const decoded = jwtService.verify(token, {
          secret: configService.get('AUTH_PUBLIC_KEY'),
          algorithms: ['RS256'],
          ignoreExpiration: false,
        });

        socket.user = {
          userId: decoded.sub,
          email: decoded.email,
          expr: decoded.exp,
        };

        return next();
      } catch (error) {
        return next(new UnauthorizedException());
      }
    });

    this.logger.log(`Socket.IO server listening on port ${port}`);

    return server;
  }
}
