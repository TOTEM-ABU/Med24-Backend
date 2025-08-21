import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Doktor haqida qisqa bio',
    example: 'Experienced cardiologist with 10+ years of practice.',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    description: 'Doktorning tajribasi yillarda',
    example: 12,
  })
  @IsNumber()
  @IsPositive()
  experience_years: number;

  @ApiProperty({
    description: 'Doktor rasmi URL',
    example: 'https://example.com/images/doctor1.jpg',
  })
  @IsString()
  image_url: string;

  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: 'clinic_456',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Specialty ID',
    example: 'specialty_789',
  })
  @IsOptional()
  @IsString()
  specialtiesId?: string;
}
