import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';
import { scrape } from 'src/scrapping';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const createdService = await this.prisma.services.create({
        data: {
          name: createServiceDto.name,
          category: createServiceDto.category,
          description: createServiceDto.description ?? null,
          image_url: createServiceDto.image_url ?? null,
        },
      });

      return {
        message: 'Service created successfully!',
        data: createdService,
      };
    } catch (error) {
      throw new BadRequestException('Service create failed!');
    }
  }

  async findAll(query: {
    name?: string;
    category?: 'DIAGNOSTICS' | 'TREATMENT' | 'ANALYSIS';
    sortBy?: 'name' | 'category' | 'createdAt';
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      name,
      category,
      sortBy = 'createdAt',
      sort = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where: Prisma.ServicesWhereInput = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(category && { category }),
    };

    const services = await this.prisma.services.findMany({
      where,
      orderBy: { [sortBy]: sort },
      skip,
      take,
      include: {
        clinicservices: true,
      },
    });

    const total = await this.prisma.services.count({ where });

    return {
      data: services,
      meta: {
        total,
        page: Number(page),
        limit: take,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const service = await this.prisma.services.findUnique({ where: { id } });

    if (!service) throw new NotFoundException('Service not found!');

    return { data: service };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    const updated = await this.prisma.services.update({
      where: { id },
      data: updateServiceDto,
    });

    return { message: 'Service updated successfully!', data: updated };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.services.delete({ where: { id } });

    return { message: 'Service removed successfully!' };
  }
}
