// src/ai/dto/send-prompt.dto.ts
import { IsString } from 'class-validator';

export class SendPromptDto {
  @IsString()
  readonly prompt: string;
}
