import { Injectable, NotFoundException } from '@nestjs/common';

import { WalletRepository } from './repository/wallet.repository';
import { Wallet } from './schema/wallet.schema';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  public async findbyUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ user_id: userId });

    if (!wallet) throw new NotFoundException('Wallet not found');

    return wallet;
  }

  public async updateBalance(walletId: string, balance: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) throw new NotFoundException('Wallet not found');

    return this.walletRepository.updateByOne({ _id: wallet._id }, { balance: wallet.balance + balance });
  }

  public async createWallet(payload: Partial<Wallet>): Promise<Wallet> {
    return this.walletRepository.createWallet(payload);
  }
}
