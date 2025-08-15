import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Yurak salomatligi' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Yurak haqida...' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://cdn.med24.uz/article1.png' })
  @IsString()
  @IsUrl()
  image_url: string;
}
