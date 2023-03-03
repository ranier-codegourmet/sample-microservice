import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PendingBalanceRepository } from './repository/pendingBalance.repository';
import { WalletRepository } from './repository/wallet.repository';
import { PendingBalance, PendingBalanceSchema } from './schema/pendingBalance.schema';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: PendingBalance.name, schema: PendingBalanceSchema },
    ]),
  ],
  controllers: [],
  providers: [PendingBalanceRepository, WalletService, WalletRepository],
  exports: [WalletService],
})
export class WalletModule {}
