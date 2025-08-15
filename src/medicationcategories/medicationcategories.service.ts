import { Injectable } from '@nestjs/common';
import { CreateMedicationcategoryDto } from './dto/create-medicationcategory.dto';
import { UpdateMedicationcategoryDto } from './dto/update-medicationcategory.dto';

@Injectable()
export class MedicationcategoriesService {
  create(createMedicationcategoryDto: CreateMedicationcategoryDto) {
    return 'This action adds a new medicationcategory';
  }

  findAll() {
    return `This action returns all medicationcategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicationcategory`;
  }

  update(id: number, updateMedicationcategoryDto: UpdateMedicationcategoryDto) {
    return `This action updates a #${id} medicationcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicationcategory`;
  }
}
