import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsUrl } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Abdurahmon', description: 'User first name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bekmirzayev', description: 'User surname' })
  @IsString()
  surname: string;

  @ApiProperty({ example: '+998901234567', description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'abdurahmon@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'Avatar URL',
  })
  @IsString()
  @IsUrl()
  avatar_url: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.USER,
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;

  @ApiProperty({
    example: 'clz123abc456',
    description: 'Region ID of the user',
  })
  @IsString()
  regionId: string;
}
