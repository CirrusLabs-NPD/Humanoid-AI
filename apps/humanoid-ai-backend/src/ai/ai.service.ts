import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CosmosClient } from '@azure/cosmos';

@Injectable()
export class AiService {
  private cosmosClient: CosmosClient;
  private database: any;
  private container: any;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const cosmosDbConnectionString = this.configService.get<string>('COSMOSDB_CONNECTION_STRING');

    if (cosmosDbConnectionString) {
      this.cosmosClient = new CosmosClient(cosmosDbConnectionString);
      try {
        this.database = this.cosmosClient.database('database');
        this.container = this.database.container('cosmosdb');
        this.logger.log('Connected to Cosmos DB successfully');
      } catch (error) {
        this.logger.error('Failed to connect to Cosmos DB', error);
      }
    } else {
      this.logger.error('COSMOSDB_CONNECTION_STRING is not defined');
    }
  }

  async getOpenAiResponse(prompt: string): Promise<string> {
    try {
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
    } catch (error) {
      this.logger.error('Failed to get OpenAI response', error);
      throw error;
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
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
    } catch (error) {
      this.logger.error('Failed to get embedding from OpenAI', error);
      throw error;
    }
  }

  async upsertEmbedding(id: string, embedding: number[], metadata: any) {
    try {
      const document = {
        id,
        embedding,
        metadata,
      };
      await this.container.items.upsert(document);
      this.logger.log('Embedding upserted successfully');
    } catch (error) {
      this.logger.error('Failed to upsert embedding', error);
      throw error;
    }
  }

  async queryEmbedding(embedding: number[], topK: number) {
    try {
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
    } catch (error) {
      this.logger.error('Failed to query embedding', error);
      throw error;
    }
  }
}
