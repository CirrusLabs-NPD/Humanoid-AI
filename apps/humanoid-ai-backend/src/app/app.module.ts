// src/app/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatModule,
    MongooseModule.forRoot('mongodb://localhost/nest')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
