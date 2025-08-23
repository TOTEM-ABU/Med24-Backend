import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegionDto) {
    const existingRegion = await this.prisma.region.findFirst({
      where: { name: data.name },
    });

    if (existingRegion) {
      throw new BadRequestException('This region already exists!');
    }

    try {
      const region = await this.prisma.region.create({ data });
      return region;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Region create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const { search = '', sort = 'asc', page = 1, limit = 10 } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where = search
        ? {
            name: {
              contains: search,
              mode: 'insensitive' as const,
            },
          }
        : {};

      const regions = await this.prisma.region.findMany({
        where,
        orderBy: { name: sort },
        skip,
        take,
        include: {
          clinics: true,
        },
      });

      const total = await this.prisma.region.count({ where });

      return {
        data: regions,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Regions fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const existingRegion = await this.prisma.region.findUnique({
        where: { id },
      });

      if (!existingRegion) {
        throw new HttpException('Region not found!', HttpStatus.NOT_FOUND);
      }

      return existingRegion;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Region fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    const existingRegion = await this.prisma.region.findUnique({
      where: { id },
    });

    if (!existingRegion) {
      throw new HttpException('Region not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.region.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Region update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingRegion = await this.prisma.region.findUnique({
      where: { id },
    });

    if (!existingRegion) {
      throw new HttpException('Region not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.region.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Region delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
