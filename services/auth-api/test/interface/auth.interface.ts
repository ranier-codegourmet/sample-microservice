import { INestApplication } from '@nestjs/common';

import { TestService } from '../utils/test.service';

export type AuthTestModule = {
  app: INestApplication;
  testService: TestService;
};
