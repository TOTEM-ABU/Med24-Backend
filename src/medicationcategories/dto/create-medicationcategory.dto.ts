import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMedicationcategoryDto {
  @ApiProperty({ example: 'Yurak dorilari' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Yurak uchun dorilar' })
  @IsString()
  description: string;
}
