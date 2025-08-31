import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateClinicserviceDto {
  @ApiProperty({ example: '150000' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '30' })
  @IsNumber()
  duration_minutes: number;

  @ApiProperty({ example: "Clinic's uuid" })
  @IsString()
  clinicsId: string;

  @ApiProperty({ example: "Service's uuid" })
  @IsString()
  servicesId: string;
}
