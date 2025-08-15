import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class PharmaciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPharmacyDto: CreatePharmacyDto) {
    try {
      return await this.prisma.pharmacies.create({
        data: createPharmacyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Pharmacy create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(params: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'name' | 'address' | 'phone' | 'website';
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { address: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { website: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    try {
      const [data, total] = await Promise.all([
        this.prisma.pharmacies.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.pharmacies.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Pharmacies fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const pharmacy = await this.prisma.pharmacies.findUnique({
        where: { id },
      });

      if (!pharmacy) {
        throw new HttpException('Pharmacy not found!', HttpStatus.NOT_FOUND);
      }

      return pharmacy;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Pharmacy fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePharmacyDto: UpdatePharmacyDto) {
    const existing = await this.prisma.pharmacies.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('Pharmacy not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.pharmacies.update({
        where: { id },
        data: updatePharmacyDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Pharmacy update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.pharmacies.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('Pharmacy not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.pharmacies.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Pharmacy delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
