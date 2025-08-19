import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Services_Category } from 'generated/prisma';

export class CreateServiceDto {
  @ApiProperty({ example: 'EKG Diagnostika' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Yurak tekshiruvi' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'DIAGNOSTICS', enum: Services_Category })
  @IsString()
  category: Services_Category;

  @ApiProperty({ example: 'https://cdn.med24.uz/service1.png' })
  @IsString()
  image_url: string;
}
