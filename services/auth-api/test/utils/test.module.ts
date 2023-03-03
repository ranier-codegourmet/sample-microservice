import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../src/model/user/schema/user.schema';
import { TestService } from './test.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
