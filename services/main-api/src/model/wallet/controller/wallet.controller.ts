import { Body, Controller, Get, Logger, Param, Put, Request } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { IRequest } from '../../../auth/interface/auth.interface';
import { CreateWalletDTO, UpdateBalanceDTO } from '../dto/wallet.dto';
import { Wallet } from '../schema/wallet.schema';
import { WalletService } from '../wallet.service';

@Controller('wallet')
export class WalletController {
  private logger: Logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Get()
  public async getUserWallet(@Request() req: IRequest): Promise<Wallet> {
    this.logger.log(`Get User Wallet user: ${req.user.userId}`);

    return this.walletService.findbyUserId(req.user.userId);
  }

  @Put('/:walletId/balance')
  public async updateWalletBalance(
    @Param('walletId') walletId: string,
    @Body() payload: UpdateBalanceDTO,
    @Request() req: IRequest,
  ): Promise<Pick<Wallet, 'balance'>> {
    this.logger.log(
      `Update Wallet Balance user: ${req.user.userId} with payload: ${JSON.stringify(
        payload,
      )} and walletId: ${walletId}`,
    );

    const { balance } = await this.walletService.updateBalance(walletId, payload.balance);

    return { balance };
  }

  @GrpcMethod('WalletService')
  public async createWallet(payload: Partial<CreateWalletDTO>): Promise<Wallet> {
    this.logger.log(`Create Wallet with payload: ${JSON.stringify(payload)}`);

    return this.walletService.createWallet({ user_id: payload.userId });
  }
}
