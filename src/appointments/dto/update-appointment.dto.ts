import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Yangi appointment sanasi va vaqti',
    example: '2025-08-21T14:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  appointment_date?: Date;

  @ApiPropertyOptional({
    description: 'Yangi appointment statusi',
    enum: Status,
    example: Status.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    description: 'Yangi izoh',
    example: 'Changed appointment due to schedule conflict',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Yangi user ID',
    example: 'user_456',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Yangi klinika ID',
    example: 'clinic_789',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Yangi doktor ID',
    example: 'doctor_999',
  })
  @IsOptional()
  @IsString()
  doctorsId?: string;
}
