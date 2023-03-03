import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  public async findOne(filter: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(filter);
  }

  public async createUser(payload: Partial<User>): Promise<User> {
    const user = await this.userModel.create(payload);

    return user;
  }
}
