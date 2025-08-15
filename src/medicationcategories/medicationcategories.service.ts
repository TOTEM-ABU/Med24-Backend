import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateMedicationcategoryDto } from './dto/create-medicationcategory.dto';
import { UpdateMedicationcategoryDto } from './dto/update-medicationcategory.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class MedicationcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicationcategoryDto: CreateMedicationcategoryDto) {
    try {
      return await this.prisma.medicationCategories.create({
        data: createMedicationcategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication category create failed!',
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

    const where = search
      ? {
          name: { contains: search, mode: 'insensitive' as const },
        }
      : {};

    try {
      const [data, total] = await Promise.all([
        this.prisma.medicationCategories.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.medicationCategories.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Medication categories fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.medicationCategories.findUnique({
        where: { id },
      });

      if (!category) {
        throw new HttpException(
          'Medication category not found!',
          HttpStatus.NOT_FOUND,
        );
      }

      return category;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication category fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateMedicationcategoryDto: UpdateMedicationcategoryDto,
  ) {
    const existing = await this.prisma.medicationCategories.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new HttpException(
        'Medication category not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.medicationCategories.update({
        where: { id },
        data: updateMedicationcategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication category update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.medicationCategories.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new HttpException(
        'Medication category not found!',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.prisma.medicationCategories.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication category delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
