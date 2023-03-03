import { Body, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { ILoginResponse, IRegisterResponse, IRequest } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req: IRequest): Promise<ILoginResponse> {
    const { user } = req;

    this.logger.log(`Login user: ${user._id}`);

    return this.authService.login(user);
  }

  @Post('register')
  public async register(@Body() payload: CreateUserDTO): Promise<IRegisterResponse> {
    this.logger.log(`Register user: ${payload.email} with payload: ${JSON.stringify(payload)}`);

    await this.authService.createUser(payload);

    return {
      message: 'User created successfully',
    };
  }
}
