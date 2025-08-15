import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicservicesService } from './clinicservices.service';
import { CreateClinicserviceDto } from './dto/create-clinicservice.dto';
import { UpdateClinicserviceDto } from './dto/update-clinicservice.dto';

@Controller('clinicservices')
export class ClinicservicesController {
  constructor(private readonly clinicservicesService: ClinicservicesService) {}

  @Post()
  create(@Body() createClinicserviceDto: CreateClinicserviceDto) {
    return this.clinicservicesService.create(createClinicserviceDto);
  }

  @Get()
  findAll() {
    return this.clinicservicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicservicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicserviceDto: UpdateClinicserviceDto) {
    return this.clinicservicesService.update(+id, updateClinicserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicservicesService.remove(+id);
  }
}
