import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Clinics_Type } from '@prisma/client';

export class CreateClinicWithImageDto {
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

  @ApiProperty({ 
    example: '{"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-20:00","sat":"09:00-18:00","sun":"10:00-16:00"}',
    description: 'Opening hours as JSON string for multipart form data'
  })
  @IsString()
  opening_hours: string;

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
