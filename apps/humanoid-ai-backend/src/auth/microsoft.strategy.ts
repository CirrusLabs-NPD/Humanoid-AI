// src/auth/microsoft.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(BearerStrategy, 'microsoft') {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get<string>('MICROSOFT_TENANT_ID')}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL: configService.get<string>('MICROSOFT_CALLBACK_URL'),
      passReqToCallback: false,
      loggingLevel: 'info',
      scope: ['profile', 'offline_access', 'user.read'],
    });
  }

  async validate(profile: any, done: Function) {
    const { oid, displayName, emails } = profile;
    const user = {
      id: oid,
      displayName,
      email: emails[0],
    };
    done(null, user);
  }
}
