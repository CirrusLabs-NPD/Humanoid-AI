// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
