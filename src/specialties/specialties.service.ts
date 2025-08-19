import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SpecialtiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    try {
      return await this.prisma.specialties.create({
        data: createSpecialtyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Specialty create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(params: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name';
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      sort = 'asc',
      sortBy = 'name',
      page = 1,
      limit = 10,
    } = params;

    const where: Prisma.SpecialtiesWhereInput = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    try {
      const [data, total] = await Promise.all([
        this.prisma.specialties.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            doctors: true,
          },
        }),
        this.prisma.specialties.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Specialties fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const specialty = await this.prisma.specialties.findUnique({
        where: { id },
      });
      if (!specialty) {
        throw new HttpException('Specialty not found!', HttpStatus.NOT_FOUND);
      }
      return specialty;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Specialty fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    const existing = await this.prisma.specialties.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('Specialty not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.specialties.update({
        where: { id },
        data: updateSpecialtyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Specialty update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.specialties.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('Specialty not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.specialties.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Specialty delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
