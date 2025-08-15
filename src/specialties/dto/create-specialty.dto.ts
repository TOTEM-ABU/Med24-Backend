import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Kardiolog' })
  @IsString()
  name: string;
}
