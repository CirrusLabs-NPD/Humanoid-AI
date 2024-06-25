import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.create(sendMessageDto);
  }

  @Get()
  async findAll() {
    return this.chatService.findAll();
  }
}
