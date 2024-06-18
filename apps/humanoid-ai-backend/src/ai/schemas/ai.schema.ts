import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AiDocument = Ai & Document;

@Schema()
export class Ai {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AiSchema = SchemaFactory.createForClass(Ai);
