import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto, userId?: string) {
    const { appointment_date, doctorsId } = data;

    const existing = await this.prisma.appointments.findFirst({
      where: { appointment_date, doctorsId },
    });

    if (existing) {
      throw new ConflictException('This appointment already exists!');
    }

    try {
      const appointment = await this.prisma.appointments.create({
        data: {
          ...data,
          userId: userId,
        },
      });
      return appointment;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Appointment create failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    status?: string;
    userId?: string;
    clinicsId?: string;
    doctorsId?: string;
    appointment_date?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'appointment_date' | 'status';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        status,
        userId,
        clinicsId,
        doctorsId,
        appointment_date,
        sort = 'asc',
        sortBy = 'appointment_date',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where: any = {};
      if (status) where.status = status;
      if (userId) where.userId = userId;
      if (clinicsId) where.clinicsId = clinicsId;
      if (doctorsId) where.doctorsId = doctorsId;
      if (appointment_date) where.appointment_date = new Date(appointment_date);

      const appointments = await this.prisma.appointments.findMany({
        where,
        orderBy: { [sortBy]: sort },
        skip,
        take,
        include: {
          User: true,
          Doctors: true,
          Clinics: true,
        },
      });

      const total = await this.prisma.appointments.count({ where });

      return {
        data: appointments,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Appointments fetch all failed!');
    }
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointments.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found!');
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const existing = await this.prisma.appointments.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Appointment not found!');
    }

    try {
      const updated = await this.prisma.appointments.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Appointment update failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.appointments.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Appointment not found!');
    }

    try {
      const deleted = await this.prisma.appointments.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Appointment delete failed!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
