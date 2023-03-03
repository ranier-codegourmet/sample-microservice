import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

import { EItemStatus } from '../interface/item.interface';

export class CreateItemDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  bid_time: number;
  @IsNotEmpty()
  @IsEnum(EItemStatus)
  status: EItemStatus.DRAFT | EItemStatus.PUBLISHED;
}

export class UpdateItemDTO {
  @IsNotEmpty()
  @IsEnum(EItemStatus)
  status: EItemStatus.DRAFT | EItemStatus.PUBLISHED;
}
