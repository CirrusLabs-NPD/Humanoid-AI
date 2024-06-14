// src/chat/chat.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<string> {
    return this.chatService.sendMessage(sendMessageDto.message);
  }

  @Get('receive')
  async receiveMessage(): Promise<string> {
    return this.chatService.receiveMessage();
  }
}
