import { Request } from 'express';

import { User } from '../../user/schema/user.schema';

export type ILogin = {
  email: string;
  password: string;
};

export type IRequest = Request & {
  user: User;
};

export type IRegisterResponse = {
  message: string;
};

export type ILoginResponse = {
  user_id: string;
  access_token: string;
};
