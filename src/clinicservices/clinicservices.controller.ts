import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClinicservicesService } from './clinicservices.service';
import { CreateClinicserviceDto } from './dto/create-clinicservice.dto';
import { UpdateClinicserviceDto } from './dto/update-clinicservice.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';

@ApiTags('ClinicServices')
@Controller('clinicservices')
export class ClinicservicesController {
  constructor(private readonly clinicservicesService: ClinicservicesService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createClinicserviceDto: CreateClinicserviceDto) {
    return this.clinicservicesService.create(createClinicserviceDto);
  }

  @Get()
  @ApiQuery({ name: 'clinicsId', required: false })
  @ApiQuery({ name: 'servicesId', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'duration', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'duration_minutes', 'clinicsId', 'servicesId'],
    example: 'price',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('clinicsId') clinicsId?: string,
    @Query('servicesId') servicesId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('duration') duration?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy')
    sortBy?: 'price' | 'duration_minutes' | 'clinicsId' | 'servicesId',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.clinicservicesService.findAll({
      clinicsId,
      servicesId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicservicesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClinicserviceDto: UpdateClinicserviceDto,
  ) {
    return this.clinicservicesService.update(id, updateClinicserviceDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicservicesService.remove(id);
  }
}
