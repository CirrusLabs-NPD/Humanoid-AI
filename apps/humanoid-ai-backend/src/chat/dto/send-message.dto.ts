// src/chat/dto/send-message.dto.ts
import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  readonly message: string;
}
