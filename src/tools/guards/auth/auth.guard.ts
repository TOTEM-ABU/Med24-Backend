import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided!');
    }
    try {
      let data = this.jwt.verify(token, { secret: 'accessSecret' });
      request['user'] = data.id;
      request['role'] = data.role;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token!');
    }
  }
}
