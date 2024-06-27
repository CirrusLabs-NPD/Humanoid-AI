// apps/humanoid-ai-backend/src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({ summary: 'Login with Microsoft' })
  @ApiResponse({ status: 200, description: 'Successfully initiated login flow.' })
  async microsoftAuth(@Req() req) {
    // Initiates the OAuth2 login flow
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({ summary: 'Microsoft OAuth2 Callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated with Microsoft.' })
  async microsoftAuthRedirect(@Req() req) {
    const user = req.user;
    const token = await this.authService.login(user);
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user profile.' })
  async getProfile(@User() user) {
    return user;
  }
}
