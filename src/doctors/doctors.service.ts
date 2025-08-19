import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/tools/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const {  clinicsId, specialtiesId, bio } = createDoctorDto;

    const exists = await this.prisma.doctors.findFirst({
      where: {  clinicsId, specialtiesId },
    });

    if (exists) {
      throw new ConflictException('Doctor already exists!');
    }

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
  }

  async findAll() {
    const doctors = await this.prisma.doctors.findMany({
      include: {
        appointments: true,
        reviews: true,
      },
    });

    return {
      data: doctors,
    };
  }

  async findOne(id: string) {
    const doctor = await this.#findDoctor(id);

    return {
      data: doctor,
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    await this.#findDoctor(id);

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
  }

  async remove(id: string) {
    await this.#findDoctor(id);

    await this.prisma.doctors.delete({
      where: { id },
    });

    return {
      message: 'Doctor removed successfully!',
    };
  }

  async #findDoctor(id: string) {
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

    return doctor;
  }
}
