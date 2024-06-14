
// src/chat/chat.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body('message') message: string): Promise<string> {
    return this.chatService.sendMessage(message);
  }

  @Get('receive')
  async receiveMessage(): Promise<string> {
    return this.chatService.receiveMessage();
  }
}
