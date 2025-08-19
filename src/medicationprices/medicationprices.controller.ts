import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { MedicationpricesService } from './medicationprices.service';
import { CreateMedicationpriceDto } from './dto/create-medicationprice.dto';
import { UpdateMedicationpriceDto } from './dto/update-medicationprice.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';

@ApiTags('Medication Prices')
@Controller('medicationprices')
export class MedicationpricesController {
  constructor(private readonly medicationpricesService: MedicationpricesService) { }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMedicationpriceDto: CreateMedicationpriceDto) {
    return this.medicationpricesService.create(createMedicationpriceDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false, description: 'Search by medication or pharmacy name' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price', 'createdAt', 'available'], description: 'Sort field' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (pagination)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (pagination)' })
  @ApiQuery({ name: 'medicationsId', required: false, type: String, description: 'Filter by medication ID' })
  @ApiQuery({ name: 'pharmaciesId', required: false, type: String, description: 'Filter by pharmacy ID' })
  @ApiQuery({ name: 'available', required: false, type: Boolean, description: 'Filter by availability' })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'price' | 'createdAt' | 'available',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('medicationsId') medicationsId?: string,
    @Query('pharmaciesId') pharmaciesId?: string,
    @Query('available') available?: string,
  ) {
    return this.medicationpricesService.findAll({
      search,
      sort,
      sortBy,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      medicationsId,
      pharmaciesId,
      available: available === 'true' ? true : available === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationpricesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationpriceDto: UpdateMedicationpriceDto,
  ) {
    return this.medicationpricesService.update(id, updateMedicationpriceDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationpricesService.remove(id);
  }
}
