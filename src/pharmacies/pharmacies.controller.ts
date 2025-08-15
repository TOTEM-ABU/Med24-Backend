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
import { PharmaciesService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmaciesService.create(createPharmacyDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'address', 'phone', 'website'],
    example: 'name',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'name' | 'address' | 'phone' | 'website',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pharmaciesService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmaciesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmaciesService.update(id, updatePharmacyDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmaciesService.remove(id);
  }
}
