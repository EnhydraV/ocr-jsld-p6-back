import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Notion } from '@modules/notions/schemas/notion.schema';

export type WorkshopDocument = HydratedDocument<Workshop>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
})
export class Workshop {
  @Prop({ required: true, trim: true, maxlength: 200 })
  name!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notion' }],
    default: [],
  })
  notions!: Notion[];
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);
