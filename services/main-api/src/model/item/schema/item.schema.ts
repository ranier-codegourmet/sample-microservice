import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EItemStatus } from '../interface/item.interface';

@Schema({
  timestamps: true,
})
export class Item {
  _id: string;

  @Prop({ type: String, required: true, index: true })
  user_id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop({
    type: String,
    enum: [EItemStatus.DRAFT, EItemStatus.PUBLISHED, EItemStatus.COMPLETED],
    default: EItemStatus.DRAFT,
  })
  status: string;

  @Prop({
    type: Number,
    default: 1,
  })
  bid_time: number;

  @Prop()
  time_window: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

export type ItemDocument = HydratedDocument<Item>;
