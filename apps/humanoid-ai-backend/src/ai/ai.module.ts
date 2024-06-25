import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AIController } from './ai.controller';
import { AiService } from './ai.service';
import { LangChainService } from './langchain.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AIController],
  providers: [AiService, LangChainService],
})
export class AIModule {}
