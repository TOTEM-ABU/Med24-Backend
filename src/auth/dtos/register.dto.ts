import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The surname of the user',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: true,
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account (minimum 6 characters)',
    example: 'password123',
    required: true,
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'URL of the user’s avatar image (optional)',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar_url?: string;

  @ApiProperty({
    description: 'Role of the user (optional)',
    example: 'user',
    required: false,
  })
  role?: string;

  @ApiProperty({
    description: 'Region ID associated with the user (optional)',
    example: 'region-123',
    required: false,
  })
  regionId?: string;
}
