import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { GetAllUsersDto } from './dto/get-all-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        surname: createUserDto.surname,
        phone: createUserDto.phone,
        email: createUserDto.email,
        password: createUserDto.password,
        avatar_url: createUserDto.avatar_url,
        role: Role[createUserDto.role as keyof typeof Role],
        regionId: createUserDto.regionId,
      },
    });
  }

  async findAll(query: GetAllUsersDto) {
    const { sortBy, sortOrder = 'asc', search, page = 1, limit = 10 } = query;

    const skip = (+page - 1) * +limit;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              surname: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
            { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const orderBy: Prisma.UserOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder }
      : { createdAt: 'desc' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: +limit,
        orderBy,
        include: {
          appointments: true,
          reviews: true,
          articles: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / +limit),
    };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        surname: updateUserDto.surname,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        password: updateUserDto.password,
        avatar_url: updateUserDto.avatar_url,
        role: Role[updateUserDto.role as keyof typeof Role],
        regionId: updateUserDto.regionId,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
