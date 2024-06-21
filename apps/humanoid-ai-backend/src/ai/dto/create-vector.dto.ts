import { IsString } from 'class-validator';

export class CreateVectorDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly text: string;
}
