import { Controller, Post, Body } from '@nestjs/common';
import { LangChainService } from './langchain.service';
import { SendPromptDto } from './dto/send-prompt.dto';
import { CreateVectorDto } from './dto/create-vector.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly langchainService: LangChainService) {}

  @Post('prompt')
  async handlePrompt(@Body() sendPromptDto: SendPromptDto): Promise<string> {
    return this.langchainService.processUserPrompt(sendPromptDto.prompt);
  }

  @Post('embed')
  async handleEmbedding(@Body() createVectorDto: CreateVectorDto): Promise<void> {
    return this.langchainService.addEmbedding(createVectorDto);
  }
}
