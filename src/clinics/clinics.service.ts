import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClinicDto) {
    const existingClinic = await this.prisma.clinics.findFirst({
      where: { name: data.name },
    });

    if (existingClinic) {
      throw new BadRequestException('This clinic already exists!');
    }

    try {
      return await this.prisma.clinics.create({
        data: {
          ...data,
          opening_hours: data.opening_hours as any,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Clinic create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name' | 'address' | 'email';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sort = 'asc',
        sortBy = 'name',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { address: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { website: { contains: search, mode: 'insensitive' as const } },
              {
                opening_hours: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {};

      const clinics = await this.prisma.clinics.findMany({
        where,
        orderBy: { [sortBy]: sort },
        skip,
        take,
        include: {
          Region: true,
        },
      });

      const total = await this.prisma.clinics.count({ where });

      return {
        data: clinics,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Clinics fetch all failed!');
    }
  }

  async findOne(id: string) {
    const existingClinic = await this.prisma.clinics.findFirst({
      where: { id },
    });

    if (!existingClinic) {
      throw new HttpException('Clinic not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.clinics.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Clinic fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateClinicDto) {
    const existingClinic = await this.prisma.clinics.findFirst({
      where: { id },
    });

    if (!existingClinic) {
      throw new HttpException('Clinic not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.clinics.update({
        where: { id },
        data: {
          ...data,
          opening_hours: data.opening_hours as any,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Clinic update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingClinic = await this.prisma.clinics.findFirst({
      where: { id },
    });

    if (!existingClinic) {
      throw new HttpException('Clinic not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.clinics.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Clinic delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
