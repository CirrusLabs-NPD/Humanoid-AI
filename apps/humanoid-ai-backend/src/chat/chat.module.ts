import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TtsModule } from '../tts/tts.module';

@Module({
  imports: [HttpModule, TtsModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
