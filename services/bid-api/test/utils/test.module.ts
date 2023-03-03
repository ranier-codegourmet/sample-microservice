import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Bid, BidSchema } from '../../src/model/bid/schema/bid.schema';
import { Item, ItemSchema } from '../../src/model/item/schema/item.schema';
import { Wallet, WalletSchema } from '../../src/model/wallet/schema/wallet.schema';
import { User, UserSchema } from '../schema/user.schema';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TestService, JwtService],
  exports: [TestService, JwtService],
})
export class TestModule {}
