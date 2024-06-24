// src/users/users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<any> {
    return this.usersService.findOneByEmail(email);
  }
}
