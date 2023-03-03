import { Inject, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import { Server } from 'socket.io';

import { ISocket } from '../../../auth/interface/auth.interface';
import { JoinBidDTO } from '../dto/bid.dto';
import { EmitBidList, EmitBidStatus } from '../interface/bid.interface';

@WebSocketGateway({
  namespace: 'bid',
  cors: {
    origin: '*',
  },
})
export class BidGateway {
  @WebSocketServer()
  private readonly io: Server;

  private readonly logger: Logger = new Logger(BidGateway.name);

  constructor(
    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,
  ) {}

  afterInit() {
    this.logger.log(`${BidGateway.name} initialized`);
  }

  async handleConnection(client: ISocket) {
    this.logger.log(`Client connected: ${client.id} user: ${client.user.userId}`);

    await this.cacheManager.set(`auth:${client.id}`, client.user.expr);
    await client.join(client.user.userId);
  }

  async handleDisconnect(client: ISocket) {
    this.logger.log(`Client disconnected: ${client.id} user: ${client.user.userId}`);

    await this.cacheManager.del(`auth:${client.id}`);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage('joinBid')
  async joinBid(@MessageBody() data: JoinBidDTO, @ConnectedSocket() client: ISocket) {
    const { item_id } = data;

    this.logger.log(`Client: ${client.id} user: ${client.user.userId} join bid: ${item_id}`);

    await client.join(item_id);
    await client.join(client.user.userId);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage('leaveBid')
  async leaveBid(@MessageBody() data: JoinBidDTO, @ConnectedSocket() client: ISocket) {
    const { item_id } = data;

    this.logger.log(`Client: ${client.id} user: ${client.user.userId} leave bid: ${item_id}`);

    await client.leave(item_id);
  }

  @Cron('*/30 * * * * *')
  async validateConnection() {
    const auths = await this.cacheManager.store.keys('auth:*');

    await Promise.all(
      auths.map(async (auth) => {
        const expr = await this.cacheManager.get<number>(auth);
        const now = DateTime.now();
        const tokenExpr = DateTime.fromMillis(expr * 1000);

        if (tokenExpr < now) {
          const socketId = auth.split(':')[1];

          this.io.to(socketId).disconnectSockets(true);
        }
      }),
    );
  }

  public async bidStatus(payload: EmitBidStatus): Promise<void> {
    const { item_id, user_id, status } = payload;
    this.logger.log(`Bid Emit status: ${item_id} user: ${user_id} status: ${status}`);

    this.io.to(`${user_id}`).emit('bidStatus', payload);
  }

  public async bidList(payload: EmitBidList): Promise<void> {
    const { item_id, list } = payload;

    this.logger.log(`Bid Emit list: ${item_id}`);

    this.io.to(item_id).emit('bidList', list);
  }
}
