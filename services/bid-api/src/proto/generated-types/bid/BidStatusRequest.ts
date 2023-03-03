// Original file: src/proto/bid.proto

export interface BidStatusRequest {
  userId?: string;
  status?: string;
  message?: string;
}

export interface BidStatusRequest__Output {
  userId: string;
  status: string;
  message: string;
}
