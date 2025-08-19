import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiQuery({ name: 'experience_years', required: false, type: Number })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'clinicsId', required: false, type: String })
  @ApiQuery({ name: 'specialtiesId', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['experience_years', 'rating'],
    example: 'experience_years',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('experience_years') experience_years?: string,
    @Query('rating') rating?: string,
    @Query('clinicsId') clinicsId?: string,
    @Query('specialtiesId') specialtiesId?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'experience_years' | 'rating',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.doctorsService.findAll({
      experience_years: experience_years
        ? parseInt(experience_years, 10)
        : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      clinicsId,
      specialtiesId,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
