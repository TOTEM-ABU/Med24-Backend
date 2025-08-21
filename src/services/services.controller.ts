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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['DIAGNOSTICS', 'TREATMENT', 'ANALYSIS'],
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'name | category | createdAt',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'asc | desc',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('name') name?: string,
    @Query('category') category?: 'DIAGNOSTICS' | 'TREATMENT' | 'ANALYSIS',
    @Query('sortBy') sortBy: 'name' | 'category' | 'createdAt' = 'createdAt',
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.servicesService.findAll({
      name,
      category,
      sortBy,
      sort,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
