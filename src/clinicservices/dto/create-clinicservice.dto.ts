import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNumber, IsUUID } from 'class-validator';

export class CreateClinicserviceDto {
  @ApiProperty({ example: '150000' })
  @IsDecimal()
  price: number;

  @ApiProperty({ example: '30' })
  @IsNumber()
  duration_minutes: number;

  @ApiProperty({ example: "Clinic's uuid" })
  @IsUUID()
  clinicsId: string;

  @ApiProperty({ example: "Service's uuid" })
  @IsUUID()
  servicesId: string;
}
