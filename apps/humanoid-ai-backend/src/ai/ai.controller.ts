// src/ai/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { SendPromptDto } from './dto/send-prompt.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('prompt')
  async getOpenAiResponse(@Body() sendPromptDto: SendPromptDto): Promise<string> {
    return this.aiService.getOpenAiResponse(sendPromptDto.prompt);
  }
}
