// src/users/dto/create-user.dto.ts
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}

