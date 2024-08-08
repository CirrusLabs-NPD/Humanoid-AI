import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns Hello World message.' })
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/voices')
  @ApiOperation({ summary: 'Get available voices' })
  @ApiResponse({ status: 200, description: 'Returns available voices.' })
  async getVoices(): Promise<any> {
    try {
      const response = await this.chatService.getAvailableVoices();
      return response;
    } catch (error) {
      this.logger.error('Error fetching voices:', error.message);
      return { error: 'Failed to fetch voices' };
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiBody({ schema: { example: { message: 'Hello, how are you?' } } })
  @ApiResponse({ status: 200, description: 'Returns chat messages with audio, lipsync, and facial expressions.' })
  async chat(@Body() body: { message: string }): Promise<any> {
    const userMessage = body.message;
    if (!userMessage) {
      return {
        messages: [
          {
            text: 'Hey dear... How was your day?',
            audio: await this.chatService.audioFileToBase64('audios/intro_0.wav'),
            lipsync: await this.chatService.readJsonTranscript('audios/intro_0.json'),
            facialExpression: 'smile',
            animation: 'Talking_1',
          },
          {
            text: 'I missed you so much... Please don\'t go for so long!',
            audio: await this.chatService.audioFileToBase64('audios/intro_1.wav'),
            lipsync: await this.chatService.readJsonTranscript('audios/intro_1.json'),
            facialExpression: 'sad',
            animation: 'Crying',
          },
        ],
      };
    }

    try {
      const completion = await this.chatService.callOpenAI(userMessage);
      let responseContent = completion.choices[0].message.content;

      // Log the raw response from OpenAI API
      this.logger.log('Raw response from OpenAI API:', responseContent);

      // Sanitize the response to extract the JSON part
      responseContent = responseContent.replace(/```json\s*([\s\S]*?)\s*```/g, '$1').trim();

      // Log the sanitized JSON part
      this.logger.log('Sanitized JSON response:', responseContent);

      // Parse the JSON content
      let messages;
      try {
        messages = JSON.parse(responseContent);
      } catch (parseError) {
        this.logger.error('Error parsing JSON response:', parseError.message);
        return { error: 'Failed to parse chat response' };
      }

      if (messages.messages) {
        messages = messages.messages;
      }

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const fileName = `message_${i}.mp3`;
        const audioResponse = await this.chatService.generateSpeech(message.text, fileName);
        message.audio = audioResponse.audio;
        message.lipsync = await this.chatService.readJsonTranscript(`audios/message_${i}.json`);
      }

      return { messages };
    } catch (error) {
      this.logger.error('Error processing chat message:', error.message);
      return { error: 'Failed to process chat message' };
    }
  }
}
