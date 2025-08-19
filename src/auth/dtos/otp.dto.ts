import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpDto {
  @ApiProperty({
    description: 'The email address associated with the OTP',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The OTP code to verify',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  otp: string;
}
