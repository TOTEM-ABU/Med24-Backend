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
import { MedicationcategoriesService } from './medicationcategories.service';
import { CreateMedicationcategoryDto } from './dto/create-medicationcategory.dto';
import { UpdateMedicationcategoryDto } from './dto/update-medicationcategory.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

@Controller('medicationcategories')
export class MedicationcategoriesController {
  constructor(
    private readonly medicationcategoriesService: MedicationcategoriesService,
  ) {}

    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMedicationcategoryDto: CreateMedicationcategoryDto) {
    return this.medicationcategoriesService.create(createMedicationcategoryDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name'],
    example: 'name',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'name',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.medicationcategoriesService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationcategoriesService.findOne(id);
  }

    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationcategoryDto: UpdateMedicationcategoryDto,
  ) {
    return this.medicationcategoriesService.update(
      id,
      updateMedicationcategoryDto,
    );
  }
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationcategoriesService.remove(id);
  }
}
