import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { TtsService } from '../tts/tts.service';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly ttsService: TtsService 
  ) {}

  async callOpenAI(userMessage: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo-1106',
            max_tokens: 1000,
            temperature: 0.6,
            messages: [
              {
                role: 'system',
                content: `
                You are a virtual Assistant.
                You will always reply with a JSON array of messages. With a maximum of 3 messages.
                Each message has a text, facialExpression, and animation property.
                The different facial expressions are: smile, sad, angry, surprised and default.
                The different animations are: Idle, Terrified, and Angry. 
                `,
              },
              {
                role: 'user',
                content: userMessage || 'Hello',
              },
            ],
          },
          {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error calling OpenAI API:', error.message);
      throw new Error('Failed to call OpenAI API');
    }
  }

  async generateSpeech(text: string, fileName: string): Promise<{ audio: string }> {
    try {
      const response = await this.ttsService.convertTextToSpeech(text);
      const audio = await this.audioFileToBase64(response.fileName);
      await this.lipSyncMessage(fileName.replace('.mp3', ''));
      return { audio };
    } catch (error) {
      this.logger.error('Error generating speech:', error.message);
      throw new Error('Failed to generate speech');
    }
  }

  async getAvailableVoices(): Promise<any> {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.elevenlabs.io/v1/voices',
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching available voices:', error.message);
      throw new Error('Failed to fetch available voices');
    }
  }

  async execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
      });
    });
  }

  async lipSyncMessage(message: string): Promise<void> {
    const time = new Date().getTime();
    this.logger.log(`Starting conversion for message ${message}`);
    await this.execCommand(`ffmpeg -y -i audios/${message}.mp3 audios/${message}.wav`);
    this.logger.log(`Conversion done in ${new Date().getTime() - time}ms`);

    const rhubarbCommand = path.join('apps', 'humanoid-ai-backend', 'rhubarb', 'rhubarb.exe') + ` -f json -o audios/${message}.json audios/${message}.wav -r phonetic`;
    await this.execCommand(rhubarbCommand);
    this.logger.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  }

  async readJsonTranscript(file: string): Promise<any> {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  }

  async audioFileToBase64(file: string): Promise<string> {
    const data = await fs.readFile(file);
    return data.toString('base64');
  }
}
