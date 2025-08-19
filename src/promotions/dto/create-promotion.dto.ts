import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'EKG 20% chegirma' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Avgust aksiyasi' })
  @IsString()
  description: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  discount_percent: number;

  @ApiProperty({ example: 'Clinics id' })
  @IsString()
  clinicsId: string;
}
