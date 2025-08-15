import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBannerDto) {
    try {
      const banner = await this.prisma.banners.create({ data });
      return banner;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Banner create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.prisma.banners.findMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Banners fetch failed!');
    }
  }

  async findOne(id: string) {
    try {
      const banner = await this.prisma.banners.findUnique({ where: { id } });

      if (!banner) {
        throw new HttpException('Banner not found!', HttpStatus.NOT_FOUND);
      }

      return banner;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Banner fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateBannerDto) {
    const existingBanner = await this.prisma.banners.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw new HttpException('Banner not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.banners.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Banner update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingBanner = await this.prisma.banners.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      throw new HttpException('Banner not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.banners.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Banner delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
