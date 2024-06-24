// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MicrosoftStrategy } from './microsoft.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule.forRoot()],
  providers: [AuthService, MicrosoftStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
