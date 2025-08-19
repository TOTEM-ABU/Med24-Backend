import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Reyting (1 dan 5 gacha)',
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Foydalanuvchi fikri',
    example: 'Doctor was good, but waiting time was too long.',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchi ID',
    example: 'user_222',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Klinika ID',
    example: 'clinic_333',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Doktor ID',
    example: 'doctor_444',
  })
  @IsOptional()
  @IsString()
  doctorsId?: string;
}
