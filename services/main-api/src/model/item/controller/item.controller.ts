import { Body, Controller, Get, Logger, Param, Post, Put, Request } from '@nestjs/common';

import { IRequest } from '../../../auth/interface/auth.interface';
import { CreateItemDTO, UpdateItemDTO } from '../dto/item.dto';
import { ICurrentItemBid } from '../interface/item.interface';
import { ItemService } from '../item.service';
import { Item } from '../schema/item.schema';

@Controller('item')
export class ItemController {
  private logger: Logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Post()
  public async createItem(@Body() payload: CreateItemDTO, @Request() req: IRequest): Promise<Item> {
    this.logger.log(`Create Item user: ${req.user.userId} with payload: ${JSON.stringify(payload)}`);

    return this.itemService.createItem({ ...payload, user_id: req.user.userId });
  }

  @Put('/:itemId')
  public async updateItem(
    @Body() payload: UpdateItemDTO,
    @Param('itemId') itemId: string,
    @Request() req: IRequest,
  ): Promise<Item> {
    this.logger.log(`Update Item user: ${req.user.userId} with payload: ${JSON.stringify(payload)}`);

    return this.itemService.updateItemStatus(itemId, payload.status);
  }

  @Get()
  public async getAllOwnItem(@Request() req: IRequest): Promise<Item[]> {
    this.logger.log(`Get All Own Item user: ${req.user.userId}`);

    return this.itemService.getAllOwnItem(req.user.userId);
  }

  @Get('/published')
  public async getAllPublishedItem(@Request() req: IRequest): Promise<Item[]> {
    this.logger.log(`Get All Published Item user: ${req.user.userId}`);

    return this.itemService.getAllPublishedItem();
  }

  @Get('/completed')
  public async getAllCompletedItem(@Request() req: IRequest): Promise<Item[]> {
    this.logger.log(`Get All Completed Item user: ${req.user.userId}`);

    return this.itemService.getAllCompletedItem();
  }

  @Get('/:itemId')
  public async getCurrentItem(@Param('itemId') itemId: string, @Request() req: IRequest): Promise<ICurrentItemBid> {
    this.logger.log(`Get Current Item user: ${req.user.userId} with itemId: ${itemId}`);

    return this.itemService.getItemBid(itemId);
  }
}
