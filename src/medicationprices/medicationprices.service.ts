import { Injectable } from '@nestjs/common';
import { CreateMedicationpriceDto } from './dto/create-medicationprice.dto';
import { UpdateMedicationpriceDto } from './dto/update-medicationprice.dto';

@Injectable()
export class MedicationpricesService {
  create(createMedicationpriceDto: CreateMedicationpriceDto) {
    return 'This action adds a new medicationprice';
  }

  findAll() {
    return `This action returns all medicationprices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicationprice`;
  }

  update(id: number, updateMedicationpriceDto: UpdateMedicationpriceDto) {
    return `This action updates a #${id} medicationprice`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicationprice`;
  }
}
