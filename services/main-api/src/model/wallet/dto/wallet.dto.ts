import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateBalanceDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  balance: number;
}

export class CreateWalletDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
