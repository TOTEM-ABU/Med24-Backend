import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, doctorsId, clinicsId } = createReviewDto;

    // optional: user bir marta review qilsin deb tekshirish
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

  async findAll() {
    const reviews = await this.prisma.reviews.findMany({
      include: {
        User: true,
        Clinics: true,
        Doctors: true,
      },
    });

    return { data: reviews };
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

    return {
      message: 'Review removed successfully!',
    };
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
