import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const {appointment_date, userId, doctorsId} = createAppointmentDto

    const appointment = await this.prisma.appointments.findFirst({where: {appointment_date, userId, doctorsId}})

    if(appointment) {
      throw new ConflictException("Appointment already exists!")
    }

    const createdAppointment = await this.prisma.appointments.create({data: createAppointmentDto as any})

    return {
      message: "Appoitment created  successfully!",
      data: createdAppointment
    }
  }

  async findAll() {

    const appointments = await this.prisma.appointments.findMany()

    return {
      data: appointments
    };
  }

  async findOne(id: string) {
    const data = await this.#findAppointment(id)

    return {
      data: data
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.#findAppointment(id)

    const upadtedAppointment = await this.prisma.appointments.update({where: {id: id}, data: updateAppointmentDto as any})

    return {
      message: "Appointment successfully updated!",
      data: upadtedAppointment
    }
  }

  async remove(id: string) {
    await this.#findAppointment(id)

    await this.prisma.appointments.delete({where: {id: id}})

    return {
      message: "Appointment removed successfully!"
    }
  }

  async  #findAppointment(id: string) {
    const appointment = await this.prisma.appointments.findUnique({where: {id: id}})

    if(appointment) {
      throw new NotFoundException("Appointment not found!")
    }

    return appointment
  }
}
