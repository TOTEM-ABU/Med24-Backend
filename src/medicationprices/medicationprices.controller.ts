import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicationpricesService } from './medicationprices.service';
import { CreateMedicationpriceDto } from './dto/create-medicationprice.dto';
import { UpdateMedicationpriceDto } from './dto/update-medicationprice.dto';

@Controller('medicationprices')
export class MedicationpricesController {
  constructor(private readonly medicationpricesService: MedicationpricesService) {}

  @Post()
  create(@Body() createMedicationpriceDto: CreateMedicationpriceDto) {
    return this.medicationpricesService.create(createMedicationpriceDto);
  }

  @Get()
  findAll() {
    return this.medicationpricesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationpricesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicationpriceDto: UpdateMedicationpriceDto) {
    return this.medicationpricesService.update(+id, updateMedicationpriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationpricesService.remove(+id);
  }
}
