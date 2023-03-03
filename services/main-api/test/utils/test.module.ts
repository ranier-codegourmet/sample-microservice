import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Item, ItemSchema } from '../../src/model/item/schema/item.schema';
import { Wallet, WalletSchema } from '../../src/model/wallet/schema/wallet.schema';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  providers: [TestService, JwtService],
  exports: [TestService, JwtService],
})
export class TestModule {}
