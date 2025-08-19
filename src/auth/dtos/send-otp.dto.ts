import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'The email address to send the OTP to',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  email: string;
}
