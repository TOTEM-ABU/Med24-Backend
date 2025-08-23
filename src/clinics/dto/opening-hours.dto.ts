import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OpeningHoursDto {
  @ApiProperty({ example: '08:00-20:00' })
  @IsString()
  mon: string;

  @ApiProperty({ example: '08:00-20:00' })
  @IsString()
  tue: string;

  @ApiProperty({ example: '08:00-20:00' })
  @IsString()
  wed: string;

  @ApiProperty({ example: '08:00-20:00' })
  @IsString()
  thu: string;

  @ApiProperty({ example: '08:00-20:00' })
  @IsString()
  fri: string;

  @ApiProperty({ example: '10:00-18:00' })
  @IsString()
  sat: string;

  @ApiProperty({ example: 'Dam olish kuni' })
  @IsString()
  sun: string;
}
