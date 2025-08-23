import { Status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment sanasi va vaqti',
    example: '2025-08-20T10:30:00.000Z',
  })
  @IsDateString()
  appointment_date: Date;

  @ApiProperty({
    description: 'Appointment statusi',
    enum: Status,
    example: Status.PENDING,
  })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'Appointment haqida qo‘shimcha izoh',
    example: 'Checkup for back pain',
  })
  @IsString()
  notes: string;

  @ApiPropertyOptional({
    description: 'Appointment qilingan klinika ID',
    example: 'clinic_456',
  })
  @IsOptional()
  @IsString()
  clinicsId?: string;

  @ApiPropertyOptional({
    description: 'Appointment uchun tanlangan doktor ID',
    example: 'doctor_789',
  })
  @IsOptional()
  @IsString()
  doctorsId?: string;
}
