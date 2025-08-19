import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: string;
}
