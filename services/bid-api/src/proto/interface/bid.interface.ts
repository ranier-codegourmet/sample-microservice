import { Observable } from 'rxjs';

import { BidStatusRequest } from '../generated-types/bid/BidStatusRequest';
import { BidStatusResponse__Output } from '../generated-types/bid/BidStatusResponse';

export interface BidRcpClient {
  bidStatus: (payload: BidStatusRequest) => Observable<BidStatusResponse__Output>;
}
