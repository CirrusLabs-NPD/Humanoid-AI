import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vector extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ type: [Number], required: true })
  embedding: number[];

  @Prop({ type: Object })
  metadata: any;
}

export const VectorSchema = SchemaFactory.createForClass(Vector);
