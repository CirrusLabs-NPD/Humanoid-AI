// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async sendMessage(message: string): Promise<string> {
    return `Echo: ${message}`;
  }

  async receiveMessage(): Promise<string> {
    return 'Received your message';
  }
}
