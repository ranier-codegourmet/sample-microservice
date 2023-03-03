import { User } from '../schema/user.schema';

export type ICreateUser = Pick<User, 'name' | 'email' | 'password'>;
