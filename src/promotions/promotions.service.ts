import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPromotionDto: CreatePromotionDto) {
    try {
      const createdPromotion = await this.prisma.promotions.create({
        data: {
          title: createPromotionDto.title,
          discount_percent: createPromotionDto.discount_percent,
          description: createPromotionDto.description ?? null,
          certificate_conditions: createPromotionDto.certificate_conditions ?? null,
          clinicsId: createPromotionDto.clinicsId ?? null,
        },
      });

      return {
        message: 'Promotion created successfully!',
        data: createdPromotion,
      };
    } catch (error) {
      throw new HttpException(
        'Promotion create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    title?: string;
    discount_percent?: number;
    clinicsId?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'title' | 'discount_percent';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        title,
        discount_percent,
        clinicsId,
        sort = 'asc',
        sortBy = 'title',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: Prisma.PromotionsWhereInput = {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(discount_percent && { discount_percent }),
        ...(clinicsId && { clinicsId }),
      };

      const promotions = await this.prisma.promotions.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip,
        take,
        include: {
          Clinics: true,
        },
      });

      const total = await this.prisma.promotions.count({ where });

      return {
        data: promotions,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new BadRequestException('Promotions fetch all failed!');
    }
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id },
      include: {
        Clinics: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found!');
    }

    return { data: promotion };
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    await this.findOne(id);

    try {
      const updatedPromotion = await this.prisma.promotions.update({
        where: { id },
        data: {
          title: updatePromotionDto.title,
          discount_percent: updatePromotionDto.discount_percent ?? undefined, // ✅ Decimal emas, number
          certificate_conditions: updatePromotionDto.certificate_conditions ?? undefined,
          clinicsId: updatePromotionDto.clinicsId ?? null,
        },
      });

      return {
        message: 'Promotion successfully updated!',
        data: updatedPromotion,
      };
    } catch (error) {
      throw new HttpException(
        'Promotion update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.promotions.delete({ where: { id } });

      return { message: 'Promotion removed successfully!' };
    } catch (error) {
      throw new HttpException(
        'Promotion delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
