import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotionDocument = HydratedDocument<Notion>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class Notion {
  @Prop({ required: true, trim: true, maxlength: 200 })
  name!: string;
}

export const NotionSchema = SchemaFactory.createForClass(Notion);
