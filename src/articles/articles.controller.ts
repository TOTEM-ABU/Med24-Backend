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
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateArticleDto, @Req() req: Request) {
    return this.articlesService.create(data, req['User']);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['title', 'content'],
    example: 'title',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'title' | 'content',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.articlesService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateArticleDto) {
    return this.articlesService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
