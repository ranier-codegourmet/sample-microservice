import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TestService } from '../utils/test.service';

export type ItemTestModule = {
  app: INestApplication;
  testService: TestService;
  jwtService: JwtService;
};
