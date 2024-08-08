import { Controller, Get, Query } from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Get()
  async convertTextToSpeech(@Query('text') text: string) {
    if (!text) {
      return { error: 'Text query parameter is required' };
    }
    const response = await this.ttsService.convertTextToSpeech(text);
    return response;
  }
}
