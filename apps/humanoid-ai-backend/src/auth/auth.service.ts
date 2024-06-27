// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateMicrosoftUser(profile: any): Promise<any> {
    const { email } = profile;
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.createMicrosoftUser(profile);
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
