import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from './repository/user.repository';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(payload: Partial<User>): Promise<User> {
    const duplicateEmail = await this.findByEmail(payload.email);

    if (duplicateEmail) throw new BadRequestException('Email already exists');

    return this.userRepository.createUser(payload);
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }
}
