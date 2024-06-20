// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth(@Req() req) {
    // Initiates the OAuth2 login flow
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthRedirect(@Req() req) {
    // Handles the OAuth2 callback
    return req.user;
  }

  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }
}
