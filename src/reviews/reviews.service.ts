import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, doctorsId, clinicsId } = createReviewDto;

    const exists = await this.prisma.reviews.findFirst({
      where: { userId, doctorsId, clinicsId },
    });

    if (exists) {
      throw new ConflictException('You already reviewed this!');
    }

    const createdReview = await this.prisma.reviews.create({
      data: createReviewDto,
    });

    return {
      message: 'Review created successfully!',
      data: createdReview,
    };
  }

  async findAll(query: {
    rating?: number;
    userId?: string;
    doctorsId?: string;
    clinicsId?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'rating' | 'createdAt';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        rating,
        userId,
        doctorsId,
        clinicsId,
        sort = 'desc',
        sortBy = 'createdAt',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: Prisma.ReviewsWhereInput = {
        ...(rating && { rating }),
        ...(userId && { userId }),
        ...(doctorsId && { doctorsId }),
        ...(clinicsId && { clinicsId }),
      };

      const reviews = await this.prisma.reviews.findMany({
        where,
        orderBy: { [sortBy]: sort },
        skip,
        take,
        include: {
          User: true,
          Clinics: true,
          Doctors: true,
        },
      });

      const total = await this.prisma.reviews.count({ where });

      return {
        data: reviews,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new BadRequestException('Reviews fetch failed!');
    }
  }

  async findOne(id: string) {
    const review = await this.#findReview(id);
    return { data: review };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    await this.#findReview(id);

    const updatedReview = await this.prisma.reviews.update({
      where: { id },
      data: updateReviewDto,
    });

    return {
      message: 'Review updated successfully!',
      data: updatedReview,
    };
  }

  async remove(id: string) {
    await this.#findReview(id);

    await this.prisma.reviews.delete({ where: { id } });

    return { message: 'Review removed successfully!' };
  }

  async #findReview(id: string) {
    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: {
        User: true,
        Clinics: true,
        Doctors: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    return review;
  }
}
