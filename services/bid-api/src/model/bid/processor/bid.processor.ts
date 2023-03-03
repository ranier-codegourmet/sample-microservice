import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { BidService } from '../bid.service';
import { BidQueueRequest } from '../interface/bid.interface';

@Processor('bid')
export class BidProcessor {
  private logger: Logger = new Logger(BidProcessor.name);

  constructor(private readonly bidService: BidService) {}

  @Process('item')
  async processBid(job: Job<BidQueueRequest>) {
    const { id, data } = job;

    this.logger.log(`Processing job ${id} with data ${JSON.stringify(data)}`);

    await this.bidService.createBid(data);

    this.logger.log(`Job ${id} processed successfully`);
  }
}
