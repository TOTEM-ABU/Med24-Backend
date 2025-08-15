import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  name: string;
}
