import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateVectorDto } from './dto/create-vector.dto';

@Injectable()
export class LangChainService {
  constructor(
    private readonly aiService: AiService
  ) {}

  async processUserPrompt(userPrompt: string): Promise<string> {
    // Get embedding for the user prompt
    const userEmbedding = await this.aiService.getEmbedding(userPrompt);

    // Query the vector database with the user embedding
    const matches = await this.aiService.queryEmbedding(userEmbedding, 5);

    // Process the matches to create a context for the response
    const context = matches.map(match => match.metadata.text).join(' ');

    // Generate a response using OpenAI with the context
    const response = await this.aiService.getOpenAiResponse(
      `${context}\nUser: ${userPrompt}\nAI:`,
    );

    return response;
  }

  async addEmbedding(createVectorDto: CreateVectorDto): Promise<void> {
    const embedding = await this.aiService.getEmbedding(createVectorDto.text);
    await this.aiService.upsertEmbedding(createVectorDto.id, embedding, { text: createVectorDto.text });
  }
}
