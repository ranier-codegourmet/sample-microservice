import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  WalletServiceClient as _main_WalletServiceClient,
  WalletServiceDefinition as _main_WalletServiceDefinition,
} from './main/WalletService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  main: {
    CreateWalletRequest: MessageTypeDefinition;
    WalletResponse: MessageTypeDefinition;
    WalletService: SubtypeConstructor<typeof grpc.Client, _main_WalletServiceClient> & {
      service: _main_WalletServiceDefinition;
    };
  };
}
