import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Dilshod' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+998909876543' })
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'dilshod@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Salom, savolim bor' })
  @IsString()
  message: string;
}
