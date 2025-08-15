import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicationcategoriesService } from './medicationcategories.service';
import { CreateMedicationcategoryDto } from './dto/create-medicationcategory.dto';
import { UpdateMedicationcategoryDto } from './dto/update-medicationcategory.dto';

@Controller('medicationcategories')
export class MedicationcategoriesController {
  constructor(private readonly medicationcategoriesService: MedicationcategoriesService) {}

  @Post()
  create(@Body() createMedicationcategoryDto: CreateMedicationcategoryDto) {
    return this.medicationcategoriesService.create(createMedicationcategoryDto);
  }

  @Get()
  findAll() {
    return this.medicationcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationcategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicationcategoryDto: UpdateMedicationcategoryDto) {
    return this.medicationcategoriesService.update(+id, updateMedicationcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationcategoriesService.remove(+id);
  }
}
