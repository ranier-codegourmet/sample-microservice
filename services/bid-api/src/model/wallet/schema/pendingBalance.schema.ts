import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  _id: false,
  versionKey: false,
})
export class PendingBalance {
  @Prop({ type: Number, required: true, default: 0 })
  amount: number;

  @Prop({ type: String, required: true })
  item_id: string;

  @Prop({ type: String, required: true })
  wallet_id: string;
}

export const PendingBalanceSchema = SchemaFactory.createForClass(PendingBalance);

export type PendingBalanceDocument = HydratedDocument<PendingBalance>;
