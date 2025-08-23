import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicationDto: CreateMedicationDto) {
    try {
      return await this.prisma.medications.create({
        data: createMedicationDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(params: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?:
      | 'name'
      | 'manufacturer'
      | 'country'
      | 'prescription_required'
      | 'createdAt';
    page?: number;
    limit?: number;
    medicationCategoriesId?: string;
  }) {
    const {
      search,
      sort = 'asc',
      sortBy = 'name',
      page = 1,
      limit = 10,
      medicationCategoriesId,
    } = params;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { composition: { contains: search, mode: 'insensitive' as const } },
        { manufacturer: { contains: search, mode: 'insensitive' as const } },
        { country: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    if (medicationCategoriesId) {
      where.medicationCategoriesId = medicationCategoriesId;
    }

    try {
      const [data, total] = await Promise.all([
        this.prisma.medications.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
          include: { MedicationCategories: true },
        }),
        this.prisma.medications.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Medications fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const medication = await this.prisma.medications.findUnique({
        where: { id },
        include: { MedicationCategories: true },
      });
      if (!medication) {
        throw new HttpException('Medication not found!', HttpStatus.NOT_FOUND);
      }
      return medication;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto) {
    const existing = await this.prisma.medications.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('Medication not found!', HttpStatus.NOT_FOUND);
    }
    try {
      return await this.prisma.medications.update({
        where: { id },
        data: updateMedicationDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.medications.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException('Medication not found!', HttpStatus.NOT_FOUND);
    }
    try {
      return await this.prisma.medications.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
