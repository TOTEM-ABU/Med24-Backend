import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OpeningHoursDto } from './opening-hours.dto';

export class CreateClinicDto {
  @ApiProperty({ example: 'Shifo Med Center' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Zamonaviy klinika' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+998971112233' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'info@shifomed.uz' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'https://shifomed.uz' })
  @IsString()
  website: string;

  @ApiProperty({ type: OpeningHoursDto })
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  opening_hours: OpeningHoursDto;

  @ApiProperty({ example: 'https://cdn.med24.uz/clinic1.png' })
  @IsString()
  logo_url: string;

  @ApiProperty({ example: 'Region id' })
  @IsString()
  regionId: string;
}
