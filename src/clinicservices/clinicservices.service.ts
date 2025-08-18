import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateClinicserviceDto } from './dto/create-clinicservice.dto';
import { UpdateClinicserviceDto } from './dto/update-clinicservice.dto';

@Injectable()
export class ClinicservicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClinicserviceDto: CreateClinicserviceDto) {
    try {
      return await this.prisma.clinicServices.create({
        data: createClinicserviceDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'ClinicService create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(params: {
    clinicsId?: string;
    serviceId?: string;
    minPrice?: number;
    maxPrice?: number;
    duration?: number;
    sort?: 'asc' | 'desc';
    sortBy?: 'price' | 'duration_minutes' | 'clinicsId' | 'serviceId';
    page?: number;
    limit?: number;
  }) {
    const {
      clinicsId,
      serviceId,
      minPrice,
      maxPrice,
      duration,
      sort = 'asc',
      sortBy = 'price',
      page = 1,
      limit = 10,
    } = params;

    const where: Prisma.ClinicServicesWhereInput = {
      ...(clinicsId && { clinicsId }),
      ...(serviceId && { serviceId }),
      ...(duration && { duration_minutes: duration }),
      ...(minPrice || maxPrice
        ? {
            price: {
              gte: minPrice ?? undefined,
              lte: maxPrice ?? undefined,
            },
          }
        : {}),
    };

    try {
      const [data, total] = await Promise.all([
        this.prisma.clinicServices.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.clinicServices.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('ClinicServices fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const clinicService = await this.prisma.clinicServices.findUnique({
        include: {
          Clinics: true,
          Services: true,
        },
        where: { id },
      });

      if (!clinicService) {
        throw new HttpException(
          'ClinicService not found!',
          HttpStatus.NOT_FOUND,
        );
      }

      return clinicService;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'ClinicService fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateClinicserviceDto: UpdateClinicserviceDto) {
    const existing = await this.prisma.clinicServices.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('ClinicService not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.clinicServices.update({
        where: { id },
        data: updateClinicserviceDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'ClinicService update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.clinicServices.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('ClinicService not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.clinicServices.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'ClinicService delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
