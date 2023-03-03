import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Bid {
  _id: string;

  @Prop({ type: String, required: true, index: true })
  user_id: string;

  @Prop({ type: String, required: true, index: true })
  item_id: string;

  @Prop()
  price: number;

  @Prop({ type: Boolean, default: false })
  sold: boolean;

  @Prop({ type: Date, default: Date.now })
  readonly createdAt: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);

export type BidDocument = HydratedDocument<Bid>;
