import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  avatar_url?: string;
  role?: string;
  regionId?: string;
}
