import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';
import { AIModule } from '../ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CosmosdbModule } from '../cosmosDB/commosdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    ChatModule,
    AIModule,
    CosmosdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
