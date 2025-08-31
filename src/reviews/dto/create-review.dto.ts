import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Reyting (1 dan 5 gacha)',
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Foydalanuvchi fikri',
    example: 'Very professional doctor, highly recommended!',
  })
  @IsString()
  comment: string;

  @ApiPropertyOptional({
    description: 'Klinika ID',
    example: 'clinic_456',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Doktor ID',
    example: 'doctor_789',
  })
  @IsOptional()
  @IsString()
  doctorsId?: string;
}
