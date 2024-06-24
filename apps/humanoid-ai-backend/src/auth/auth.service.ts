// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateMicrosoftUser(profile: any): Promise<any> {
    const { email } = profile;
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.createMicrosoftUser(profile);
    }
    return user;
  }
}
