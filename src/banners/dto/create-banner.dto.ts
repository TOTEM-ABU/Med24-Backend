import { ApiProperty } from '@nestjs/swagger';
import { Position } from '@prisma/client';
import { IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'https://cdn.med24.uz/banner1.png' })
  @IsString()
  @IsUrl()
  image_url: string;

  @ApiProperty({ example: 'https://med24.uz/aksiyalar' })
  @IsString()
  @IsUrl()
  link_url: string;

  @ApiProperty({ enum: Position, example: 'TOP, SIDEBAR, FOOTER' })
  @IsString()
  position: Position;
}
