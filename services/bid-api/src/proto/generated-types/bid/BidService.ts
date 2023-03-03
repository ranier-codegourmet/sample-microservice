// Original file: src/proto/bid.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';

import type {
  BidStatusRequest as _bid_BidStatusRequest,
  BidStatusRequest__Output as _bid_BidStatusRequest__Output,
} from '../bid/BidStatusRequest';
import type {
  BidStatusResponse as _bid_BidStatusResponse,
  BidStatusResponse__Output as _bid_BidStatusResponse__Output,
} from '../bid/BidStatusResponse';

export interface BidServiceClient extends grpc.Client {
  BidStatus(
    argument: _bid_BidStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  BidStatus(
    argument: _bid_BidStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  BidStatus(
    argument: _bid_BidStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  BidStatus(
    argument: _bid_BidStatusRequest,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  bidStatus(
    argument: _bid_BidStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  bidStatus(
    argument: _bid_BidStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  bidStatus(
    argument: _bid_BidStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
  bidStatus(
    argument: _bid_BidStatusRequest,
    callback: grpc.requestCallback<_bid_BidStatusResponse__Output>,
  ): grpc.ClientUnaryCall;
}

export interface BidServiceHandlers extends grpc.UntypedServiceImplementation {
  BidStatus: grpc.handleUnaryCall<_bid_BidStatusRequest__Output, _bid_BidStatusResponse>;
}

export interface BidServiceDefinition extends grpc.ServiceDefinition {
  BidStatus: MethodDefinition<
    _bid_BidStatusRequest,
    _bid_BidStatusResponse,
    _bid_BidStatusRequest__Output,
    _bid_BidStatusResponse__Output
  >;
}
