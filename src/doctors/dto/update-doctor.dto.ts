import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateDoctorDto {
  @ApiPropertyOptional({
    description: 'Doktor haqida qisqa bio',
    example: 'Updated bio: specialized in pediatric cardiology.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Doktorning tajribasi yillarda',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  experience_years?: number;

  @ApiPropertyOptional({
    description: 'Doktor reytingi (decimal)',
    example: '4.9',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1', force_decimal: false })
  rating?: string;

  @ApiPropertyOptional({
    description: 'Doktor rasmi URL',
    example: 'https://example.com/images/doctor-updated.jpg',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'User ID',
    example: 'user_999',
  })


  @ApiPropertyOptional({
    description: 'Clinic ID',
    example: 'clinic_222',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Specialty ID',
    example: 'specialty_555',
  })
  @IsOptional()
  @IsString()
  specialtiesId?: string;
}
