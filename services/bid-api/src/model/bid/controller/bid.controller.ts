import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Logger, Param, Post, Request } from '@nestjs/common';
import { Queue } from 'bull';

import { IRequest } from '../../../auth/interface/auth.interface';
import { BidService } from '../bid.service';
import { CreateBidItemDTO } from '../dto/bid.dto';
import { UserBid } from '../interface/bid.interface';

@Controller('bid')
export class BidController {
  private logger: Logger = new Logger(BidController.name);

  constructor(
    private readonly bidService: BidService,
    @InjectQueue('bid')
    private readonly bidQueue: Queue,
  ) {}

  onModuleInit() {
    this.bidService.updateBidWinner();
  }

  @Post()
  async bidItem(@Body() payload: CreateBidItemDTO, @Request() req: IRequest) {
    const requestPayload = { ...payload, user_id: req.user.userId };

    await this.bidService.verifyBid(requestPayload);

    this.bidQueue.add('item', requestPayload);

    return {
      message: 'Bid item in process',
    };
  }

  @Get('/item/:itemId')
  async bidList(@Param('itemId') itemId: string): Promise<UserBid[]> {
    return this.bidService.getAllBidByItemId(itemId);
  }
}
