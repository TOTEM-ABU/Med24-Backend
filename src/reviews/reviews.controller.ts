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
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from 'generated/prisma';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { Request } from 'express';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: Request) {
    const userId = (req as any)?.user?.id;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'doctorsId', required: false, type: String })
  @ApiQuery({ name: 'clinicsId', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'createdAt | rating',
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
    @Query('userId') userId?: string,
    @Query('doctorsId') doctorsId?: string,
    @Query('clinicsId') clinicsId?: string,
    @Query('sortBy') sortBy: 'createdAt' | 'rating' = 'createdAt',
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reviewsService.findAll({
      userId,
      doctorsId,
      clinicsId,
      sortBy,
      sort,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
