// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async sendMessage(message: string): Promise<string> {
    // Add logic to process the message
    return `Echo: ${message}`;
  }

  async receiveMessage(): Promise<string> {
    // Add logic to receive the message
    return 'Received your message';
  }
}
