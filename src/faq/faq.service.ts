import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFaqDto) {
    try {
      const faq = await this.prisma.fAQ.create({ data });
      return faq;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.prisma.fAQ.findMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('FAQs fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const existingFaq = await this.prisma.fAQ.findUnique({
        where: { id },
      });

      if (!existingFaq) {
        throw new HttpException('FAQ not found!', HttpStatus.NOT_FOUND);
      }

      return existingFaq;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'FAQ fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateFaqDto) {
    const existingFaq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      throw new HttpException('FAQ not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingFaq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFaq) {
      throw new HttpException('FAQ not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.fAQ.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('FAQ delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
