import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateMedicationpriceDto } from './dto/create-medicationprice.dto';
import { UpdateMedicationpriceDto } from './dto/update-medicationprice.dto';

@Injectable()
export class MedicationpricesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicationpriceDto: CreateMedicationpriceDto) {
    const { medicationsId, pharmaciesId } = createMedicationpriceDto;
    try {
      await Promise.all([
        this.prisma.medications.findUniqueOrThrow({
          where: { id: medicationsId },
        }),
        this.prisma.pharmacies.findUniqueOrThrow({
          where: { id: pharmaciesId },
        }),
      ]);

      return await this.prisma.medicationPrices.create({
        data: createMedicationpriceDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication price create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(params: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'price' | 'createdAt' | 'available';
    page?: number;
    limit?: number;
    medicationsId?: string;
    pharmaciesId?: string;
    available?: boolean;
  }) {
    const {
      search,
      sort = 'asc',
      sortBy = 'price',
      page = 1,
      limit = 10,
      medicationsId,
      pharmaciesId,
      available,
    } = params;

    const where: any = {};
    if (search) {
      where.OR = [
        {
          Medications: {
            name: { contains: search, mode: 'insensitive' as const },
          },
        },
        {
          Pharmacies: {
            name: { contains: search, mode: 'insensitive' as const },
          },
        },
      ];
    }
    if (medicationsId) where.medicationsId = medicationsId;
    if (pharmaciesId) where.pharmaciesId = pharmaciesId;
    if (typeof available === 'boolean') where.available = available;

    try {
      const [data, total] = await Promise.all([
        this.prisma.medicationPrices.findMany({
          where,
          orderBy: { [sortBy]: sort },
          skip: (page - 1) * limit,
          take: limit,
          include: { Medications: true, Pharmacies: true },
        }),
        this.prisma.medicationPrices.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Medication prices fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const price = await this.prisma.medicationPrices.findUnique({
        where: { id },
        include: { Medications: true, Pharmacies: true },
      });
      if (!price) {
        throw new HttpException(
          'Medication price not found!',
          HttpStatus.NOT_FOUND,
        );
      }
      return price;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication price fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateMedicationpriceDto: UpdateMedicationpriceDto) {
    const existing = await this.prisma.medicationPrices.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException(
        'Medication price not found!',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return await this.prisma.medicationPrices.update({
        where: { id },
        data: updateMedicationpriceDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication price update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.medicationPrices.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new HttpException(
        'Medication price not found!',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return await this.prisma.medicationPrices.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Medication price delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
