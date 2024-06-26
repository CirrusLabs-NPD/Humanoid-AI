import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CosmosClient } from '@azure/cosmos';
import { configuration } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    {
      provide: 'COSMOS_DB_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const endpoint = configService.get<string>('COSMOS_ACCOUNT_ENDPOINT');
        const key = configService.get<string>('COSMOS_ACCOUNT_KEY');
        const client = new CosmosClient({ endpoint, key, userAgentSuffix: 'CosmosDBJavascriptQuickstart' });

        try {
          // Perform a simple operation to verify the connection
          await client.databases.readAll().fetchAll();
          Logger.log('Successfully connected to Cosmos DB');
        } catch (error) {
          Logger.error('Failed to connect to Cosmos DB', error);
          throw error;
        }

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['COSMOS_DB_CLIENT'],
})
export class CosmosdbModule {}
