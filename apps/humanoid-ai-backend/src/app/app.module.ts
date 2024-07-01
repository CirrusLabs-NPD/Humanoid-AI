import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';
import { AIModule } from '../ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CosmosdbModule } from '../cosmosDB/commosdb.module';
import { ExportController } from '../export/export.controller'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    ChatModule,
    AIModule,
    CosmosdbModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
    }),
  ],
  controllers: [AppController, ExportController], 
  providers: [AppService],
})
export class AppModule {}
