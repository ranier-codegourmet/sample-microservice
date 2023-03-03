import { Observable } from 'rxjs';

import { CreateWalletRequest } from '../generated-types/main/CreateWalletRequest';
import { WalletResponse__Output } from '../generated-types/main/WalletResponse';

export type WalletRcpConfig = {
  url: string;
};

export interface WalletRcpClient {
  createWallet: (payload: CreateWalletRequest) => Observable<WalletResponse__Output>;
}
