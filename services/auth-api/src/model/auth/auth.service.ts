import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { WalletRcpClient } from '../../rpc/interface/wallet.interface';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from './dto/auth.dto';
import { ILoginResponse } from './interface/auth.interface';

@Injectable()
export class AuthService {
  private walletService: WalletRcpClient;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('WALLET_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.walletService = this.client.getService<WalletRcpClient>('WalletService');
  }

  public async createUser(payload: CreateUserDTO): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await this.userService.createUser({
      ...payload,
      password: hashedPassword,
      salt,
    });

    firstValueFrom(this.walletService.createWallet({ userId: user._id }));

    return user;
  }

  public async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }

  public async login(user: User): Promise<ILoginResponse> {
    const payload = { email: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload);
    return {
      user_id: user._id,
      access_token: accessToken,
    };
  }
}
