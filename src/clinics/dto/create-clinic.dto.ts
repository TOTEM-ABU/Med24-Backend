import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OpeningHoursDto } from './opening-hours.dto';
import { Clinics_Type } from '@prisma/client';

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

  @ApiProperty({ 
    example: 'https://cdn.med24.uz/clinic1-image.jpg',
    required: false,
    description: 'Additional clinic image URL'
  })
  @IsString()
  image_url?: string;

  @ApiProperty({ 
    example: 'https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496',
    required: false,
    description: 'Yandex Maps URL for clinic location'
  })
  @IsString()
  yandex_map_url?: string;

  @ApiProperty({ example: 'PUBLIC/PRIVATE/VETERINARY', enum: Clinics_Type })
  @IsEnum(Clinics_Type)
  @IsString()
  type: Clinics_Type;

  @ApiProperty({ example: 'Region id' })
  @IsString()
  regionId: string;
}
