import { Request } from 'express';
import { Socket } from 'socket.io';

export type JwtUser = {
  user: {
    userId: string;
    email: string;
    expr?: number;
  };
};

export type IRequest = Request & JwtUser;
export type ISocket = Socket & JwtUser;
