import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const { clinicsId, specialtiesId } = createDoctorDto;

    const exists = await this.prisma.doctors.findFirst({
      where: { clinicsId, specialtiesId },
    });

    if (exists) {
      throw new BadRequestException('Doctor already exists!');
    }

    try {
      const createdDoctor = await this.prisma.doctors.create({
        data: {
          bio: createDoctorDto.bio,
          experience_years: createDoctorDto.experience_years,
          rating: new Prisma.Decimal(createDoctorDto.rating),
          image_url: createDoctorDto.image_url,
          clinicsId: createDoctorDto.clinicsId ?? null,
          specialtiesId: createDoctorDto.specialtiesId ?? null,
        },
      });

      return {
        message: 'Doctor created successfully!',
        data: createdDoctor,
      };
    } catch (error) {
      throw new HttpException('Doctor create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    experience_years?: number;
    rating?: number;
    clinicsId?: string;
    specialtiesId?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'experience_years' | 'rating';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        experience_years,
        rating,
        clinicsId,
        specialtiesId,
        sort = 'asc',
        sortBy = 'experience_years',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: Prisma.DoctorsWhereInput = {
        ...(experience_years && {
          experience_years: { gte: experience_years },
        }),
        ...(rating && { rating: { gte: new Prisma.Decimal(rating) } }),
        ...(clinicsId && { clinicsId }),
        ...(specialtiesId && { specialtiesId }),
      };

      const doctors = await this.prisma.doctors.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip,
        take,
        include: {
          appointments: true,
          reviews: true,
        },
      });

      const total = await this.prisma.doctors.count({ where });

      return {
        data: doctors,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      throw new BadRequestException('Doctors fetch all failed!');
    }
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { id },
      include: {
        appointments: true,
        reviews: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found!');
    }

    return {
      data: doctor,
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    await this.findOne(id);

    try {
      const updatedDoctor = await this.prisma.doctors.update({
        where: { id },
        data: {
          bio: updateDoctorDto.bio,
          experience_years: updateDoctorDto.experience_years,
          rating: updateDoctorDto.rating
            ? new Prisma.Decimal(updateDoctorDto.rating)
            : undefined,
          image_url: updateDoctorDto.image_url,
          clinicsId: updateDoctorDto.clinicsId ?? null,
          specialtiesId: updateDoctorDto.specialtiesId ?? null,
        },
      });

      return {
        message: 'Doctor successfully updated!',
        data: updatedDoctor,
      };
    } catch (error) {
      throw new HttpException('Doctor update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.doctors.delete({
        where: { id },
      });

      return {
        message: 'Doctor removed successfully!',
      };
    } catch (error) {
      throw new HttpException('Doctor delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
