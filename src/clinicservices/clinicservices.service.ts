import { Injectable } from '@nestjs/common';
import { CreateClinicserviceDto } from './dto/create-clinicservice.dto';
import { UpdateClinicserviceDto } from './dto/update-clinicservice.dto';

@Injectable()
export class ClinicservicesService {
  create(createClinicserviceDto: CreateClinicserviceDto) {
    return 'This action adds a new clinicservice';
  }

  findAll() {
    return `This action returns all clinicservices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clinicservice`;
  }

  update(id: number, updateClinicserviceDto: UpdateClinicserviceDto) {
    return `This action updates a #${id} clinicservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinicservice`;
  }
}
