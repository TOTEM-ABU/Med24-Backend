import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class CreatePharmacyDto {
  @ApiProperty({ example: 'Dorixonalar Tarmog‘i' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Toshkent, Yunusobod' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+998971234567' })
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'https://dori.uz' })
  @IsString()
  @IsUrl()
  website: string;

  @ApiProperty({ example: '{"mon":"08:00-22:00","tue":"08:00-22:00"}' })
  @IsString()
  @IsJSON()
  opening_hours: string;
}
