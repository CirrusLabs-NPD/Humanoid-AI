// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    { id: 1, username: 'john', email: 'john@example.com' },
    { id: 2, username: 'maria', email: 'maria@example.com' },
  ];

  async findOneByEmail(email: string): Promise<any | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createMicrosoftUser(profile: any): Promise<any> {
    const newUser = {
      id: this.users.length + 1,
      username: profile.displayName,
      email: profile.email,
    };
    this.users.push(newUser);
    return newUser;
  }
}
