import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CosmosClient } from '@azure/cosmos';

@Injectable()
export class AiService {
  private cosmosClient: CosmosClient;
  private database: any;
  private container: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.cosmosClient = new CosmosClient(this.configService.get<string>('COSMOSDB_CONNECTION_STRING'));
    this.database = this.cosmosClient.database('your-database-name');
    this.container = this.database.container('your-container-name');
  }

  async getOpenAiResponse(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt,
          max_tokens: 100,
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )
    );

    return response.data.choices[0].text;
  }

  async getEmbedding(text: string): Promise<number[]> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-ada-002',
          input: text,
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      )
    );

    return response.data.data[0].embedding;
  }

  async upsertEmbedding(id: string, embedding: number[], metadata: any) {
    const document = {
      id,
      embedding,
      metadata,
    };
    await this.container.items.upsert(document);
  }

  async queryEmbedding(embedding: number[], topK: number) {
    const querySpec = {
      query: 'SELECT c.id, c.metadata, VectorDistance(c.embedding, @embedding) AS SimilarityScore FROM c ORDER BY SimilarityScore ASC',
      parameters: [
        {
          name: '@embedding',
          value: embedding,
        },
      ],
    };

    const { resources: results } = await this.container.items.query(querySpec).fetchAll();
    return results.slice(0, topK);
  }
}
