import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'Qanday ro‘yxatdan o‘taman?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'Telefon raqamingiz orqali' })
  @IsString()
  answer: string;
}
