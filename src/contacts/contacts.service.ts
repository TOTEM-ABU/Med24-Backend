import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateContactDto) {
    const existingContact = await this.prisma.contacts.findFirst({
      where: { email: data.email },
    });

    if (existingContact) {
      throw new BadRequestException('This contact already exists!');
    }

    try {
      return await this.prisma.contacts.create({ data });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Contact creation failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    search?: string;
    sortBy?: 'name' | 'email' | 'phone';
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sortBy = 'name',
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const contacts = await this.prisma.contacts.findMany({
        where,
        orderBy: { [sortBy]: sort },
        skip,
        take,
      });

      const total = await this.prisma.contacts.count({ where });

      return {
        data: contacts,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Fetching contacts failed!');
    }
  }

  async findOne(id: string) {
    const existingContact = await this.prisma.contacts.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new HttpException('Contact not found!', HttpStatus.NOT_FOUND);
    }

    return existingContact;
  }

  async update(id: string, data: UpdateContactDto) {
    const existingContact = await this.prisma.contacts.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new HttpException('Contact not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.contacts.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Contact update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingContact = await this.prisma.contacts.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new HttpException('Contact not found!', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.contacts.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Contact deletion failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
