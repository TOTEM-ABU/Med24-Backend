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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'discount_percent', required: false, type: Number })
  @ApiQuery({ name: 'clinicsId', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['title', 'discount_percent'],
    example: 'title',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('title') title?: string,
    @Query('discount_percent') discount_percent?: string,
    @Query('clinicsId') clinicsId?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'title' | 'discount_percent',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.promotionsService.findAll({
      title,
      discount_percent: discount_percent
        ? parseFloat(discount_percent)
        : undefined,
      clinicsId,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard, AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
