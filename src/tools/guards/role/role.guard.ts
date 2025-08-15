import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request['role'];

    if (!userRole) {
      throw new UnauthorizedException('User role not found in request');
    }

    if (requiredRoles.some((role) => role === userRole)) {
      return true;
    }

    throw new UnauthorizedException(
      `You need one of these roles: ${requiredRoles.join(', ')}`,
    );
  }
}
