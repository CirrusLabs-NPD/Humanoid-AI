import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ElevenLabs } from './elevenlabs'; // Ensure the correct path is used
import * as fs from 'fs-extra';

dotenv.config();

@Injectable()
export class TtsService {
  private elevenLabs: ElevenLabs;

  constructor() {
    this.elevenLabs = new ElevenLabs({ apiKey: process.env.ELEVENLABS_API_KEY });
  }

  async convertTextToSpeech(text: string): Promise<{ fileName: string }> {
    const directory = './audios';
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const fileName = `${directory}/message_0.mp3`;

    await this.elevenLabs.textToSpeech({
      fileName,
      textInput: text,
      stability: 0.5,
      similarityBoost: 1.0,
      modelId: 'eleven_turbo_v2_5',
      style: 0.0,
      speakerBoost: true
    });

    return { fileName };
  }
}
