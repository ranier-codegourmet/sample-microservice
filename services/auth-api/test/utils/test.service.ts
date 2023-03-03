import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../src/model/user/schema/user.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public async createUser(payload: Partial<User>): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      salt,
    });

    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  public async clearDatabase(): Promise<void> {
    await this.userModel.deleteMany({});
  }
}
