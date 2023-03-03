import { BadRequestException, Injectable } from '@nestjs/common';

import { PendingBalanceRepository } from './repository/pendingBalance.repository';
import { WalletRepository } from './repository/wallet.repository';
import { PendingBalance } from './schema/pendingBalance.schema';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly pendingBalanceRepository: PendingBalanceRepository,
  ) {}

  public async updateBalanceFromPendingBalance(userId: string, itemId: string): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);

    const pendingBalance = await this.pendingBalanceRepository.findOne({
      wallet_id: String(wallet._id),
      item_id: itemId,
    });

    await Promise.all([
      this.walletRepository.updateByOne(
        {
          _id: wallet._id,
        },
        {
          $inc: {
            balance: -pendingBalance.amount,
          },
        },
      ),
      this.pendingBalanceRepository.deleteOne({
        wallet_id: String(wallet._id),
        item_id: itemId,
      }),
    ]);
  }

  public async verifyWalletBalance(userId: string, itemId: string, bidAmount: number): Promise<void> {
    const wallet = await this.walletRepository.findByUserId(userId);
    const pendingBalance = await this.pendingBalanceRepository.getSumOfPendingBalanceExludeItemId(
      String(wallet._id),
      itemId,
    );

    if (wallet.balance < pendingBalance + bidAmount) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  public async updatePendingBalance(userId: string, itemId: string, bidAmount: number): Promise<PendingBalance> {
    const wallet = await this.walletRepository.findByUserId(userId);

    return this.pendingBalanceRepository.findOneAndUpdate(
      {
        wallet_id: wallet._id,
        item_id: itemId,
      },
      {
        $set: {
          amount: bidAmount,
        },
      },
    );
  }
}
