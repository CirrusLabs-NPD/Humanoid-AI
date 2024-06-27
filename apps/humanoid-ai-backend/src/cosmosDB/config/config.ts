export const configuration = () => ({
  COSMOS_ACCOUNT_ENDPOINT: process.env.COSMOS_ACCOUNT_ENDPOINT || 'https://localhost:8081',
  COSMOS_ACCOUNT_KEY: process.env.COSMOS_ACCOUNT_KEY || 'C2FBBG7IC4AG3P0==', 
  COSMOS_DATABASE_ID: process.env.COSMOS_DATABASE_ID || 'my-database',
  COSMOS_CONTAINER_ID: process.env.COSMOS_CONTAINER_ID || 'my-container',
  COSMOS_APPNAME: process.env.COSMOS_APPNAME || 'MyApp',
  COSMOS_MAX_IDLE_TIME_MS: process.env.COSMOS_MAX_IDLE_TIME_MS || '60000',
  COSMOSDB_CONNECTION_STRING: process.env.COSMOSDB_CONNECTION_STRING || 'AccountEndpoint=https://localhost:8081/;AccountKey=C2FBBG7IC4AG3P0==;',

});
