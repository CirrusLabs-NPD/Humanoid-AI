// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';
import { Ai, AiSchema } from './schemas/ai.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Ai.name, schema: AiSchema }]),
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
