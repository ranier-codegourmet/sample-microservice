import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Wallet {
  _id: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  user_id: string;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

export type WalletDocument = HydratedDocument<Wallet>;
