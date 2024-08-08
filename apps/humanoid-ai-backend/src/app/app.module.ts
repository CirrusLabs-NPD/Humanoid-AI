import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from '../chat/chat.module';
import { TtsModule } from '../tts/tts.module';
import { ChatController } from '../chat/chat.controller';
import { ChatService } from '../chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule, // Ensure this is included
    ChatModule,
    TtsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule {}
