import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { MailService } from 'src/tools/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { OtpDto } from './dtos/otp.dto';

// In-memory OTP storage
const otpStore: Record<string, { code: string; expires: Date }> = {};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // Register a new user
  async register(dto: RegisterDto) {
    const exist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exist) throw new BadRequestException('User already exists!');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        phone: dto.phone,
        email: dto.email,
        password: hashed,
        avatar_url: dto.avatar_url || '',
        role: dto.role ? Role[dto.role as keyof typeof Role] : Role.USER,
        regionId: dto.regionId,
      },
    });

    return { message: 'Registered successfully', userId: user.id };
  }

  // User login
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in memory
    otpStore[email] = { code: otp, expires };

    // Send OTP via email using MailService
    const result = await this.mailService.sendMail(
      email,
      'Sizning OTP kodingiz!',
      `Ushbu OTP  ${otp}. 5 daqiqa ichida uni kiriting!`,
    );

    if (result !== 'Success!') {
      throw new BadRequestException('Failed to send OTP');
    }

    return { message: 'OTP sent!' };
  }

  verifyOtp(dto: OtpDto) {
    const otpData = otpStore[dto.email];
    if (!otpData) throw new BadRequestException('No OTP found!');

    if (otpData.code !== dto.otp || otpData.expires < new Date())
      throw new BadRequestException('Invalid or expired OTP!');

    delete otpStore[dto.email];

    return { message: 'OTP verified successfully!' };
  }
}
