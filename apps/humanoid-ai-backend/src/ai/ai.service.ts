import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService, // Inject HttpService from @nestjs/axios
    private readonly configService: ConfigService
  ) {}

  async getOpenAiResponse(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const response = await this.httpService.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt,
        max_tokens: 100,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    ).toPromise();

    return response.data.choices[0].text;
  }
}
