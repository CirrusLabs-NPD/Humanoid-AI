// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { AIModule } from '../ai/ai.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    AIModule 
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
