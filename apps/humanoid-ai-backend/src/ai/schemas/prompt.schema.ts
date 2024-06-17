// src/ai/schemas/prompt.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromptDocument = Prompt & Document;

@Schema()
export class Prompt {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);
