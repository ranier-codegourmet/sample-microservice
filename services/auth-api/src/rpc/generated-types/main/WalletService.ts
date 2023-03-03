// Original file: src/rpc/main.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';

import type {
  CreateWalletRequest as _main_CreateWalletRequest,
  CreateWalletRequest__Output as _main_CreateWalletRequest__Output,
} from '../main/CreateWalletRequest';
import type {
  WalletResponse as _main_WalletResponse,
  WalletResponse__Output as _main_WalletResponse__Output,
} from '../main/WalletResponse';

export interface WalletServiceClient extends grpc.Client {
  CreateWallet(
    argument: _main_CreateWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  CreateWallet(
    argument: _main_CreateWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  CreateWallet(
    argument: _main_CreateWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  CreateWallet(
    argument: _main_CreateWalletRequest,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  createWallet(
    argument: _main_CreateWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  createWallet(
    argument: _main_CreateWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  createWallet(
    argument: _main_CreateWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
  createWallet(
    argument: _main_CreateWalletRequest,
    callback: grpc.requestCallback<_main_WalletResponse__Output>,
  ): grpc.ClientUnaryCall;
}

export interface WalletServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateWallet: grpc.handleUnaryCall<_main_CreateWalletRequest__Output, _main_WalletResponse>;
}

export interface WalletServiceDefinition extends grpc.ServiceDefinition {
  CreateWallet: MethodDefinition<
    _main_CreateWalletRequest,
    _main_WalletResponse,
    _main_CreateWalletRequest__Output,
    _main_WalletResponse__Output
  >;
}
