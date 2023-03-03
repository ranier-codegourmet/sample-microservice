import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBidItemDTO {
  @IsNotEmpty()
  @IsString()
  item_id: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class JoinBidDTO {
  @IsNotEmpty()
  @IsString()
  item_id: string;
}
