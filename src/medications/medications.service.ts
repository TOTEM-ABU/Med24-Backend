import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateMedicationFaqDto } from './dto/create-medication-faq.dto';
import { UpdateMedicationFaqDto } from './dto/update-medication-faq.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMedicationDto: CreateMedicationDto) {
    console.log(createMedicationDto);
    
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
      | 'createdAt'
      | 'updatedAt';
    page?: number;
    limit?: number;
    medicationCategoriesId?: string;
    prescription_required?: boolean;
    manufacturer?: string;
    country?: string;
  }) {
    const {
      search,
      sort = 'asc',
      sortBy = 'name',
      page = 1,
      limit = 10,
      medicationCategoriesId,
      prescription_required,
      manufacturer,
      country,
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
    if (prescription_required !== undefined) {
      where.prescription_required = prescription_required;
    }
    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: 'insensitive' as const };
    }
    if (country) {
      where.country = { contains: country, mode: 'insensitive' as const };
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

  // FAQ Methods for Medications

  async getMedicationFaqs(medicationId: string) {
    const existingMedication = await this.prisma.medications.findFirst({
      where: { id: medicationId },
    });

    if (!existingMedication) {
      throw new HttpException('Medication not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.findMany({
        where: { medicationId },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQs fetch failed!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addMedicationFaq(medicationId: string, createFaqDto: CreateMedicationFaqDto) {
    const existingMedication = await this.prisma.medications.findFirst({
      where: { id: medicationId },
    });

    if (!existingMedication) {
      throw new HttpException('Medication not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.create({
        data: {
          ...createFaqDto,
          medicationId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async updateMedicationFaq(
    medicationId: string,
    faqId: string,
    updateFaqDto: UpdateMedicationFaqDto,
  ) {
    const existingFaq = await this.prisma.fAQ.findFirst({
      where: { 
        id: faqId,
        medicationId: medicationId,
      },
    });

    if (!existingFaq) {
      throw new HttpException('FAQ not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.update({
        where: { id: faqId },
        data: updateFaqDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async removeMedicationFaq(medicationId: string, faqId: string) {
    const existingFaq = await this.prisma.fAQ.findFirst({
      where: { 
        id: faqId,
        medicationId: medicationId,
      },
    });

    if (!existingFaq) {
      throw new HttpException('FAQ not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.delete({ where: { id: faqId } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
