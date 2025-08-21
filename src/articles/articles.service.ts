import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateArticleDto, userId: string) {
    const existingArticle = await this.prisma.articles.findFirst({
      where: { title: data.title },
    });

    if (existingArticle) {
      throw new BadRequestException('This article already exists!');
    }

    try {
      const article = await this.prisma.articles.create({
        data: { ...data, userId },
      });
      return article;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Article create failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    sortBy?: 'title' | 'content';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sort = 'asc',
        sortBy = 'title',
        page = 1,
        limit = 10,
      } = query;

      const take = Number(limit);
      const skip = (Number(page) - 1) * take;

      const where = search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                content: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {};

      const articles = await this.prisma.articles.findMany({
        where,
        orderBy: {
          [sortBy]: sort,
        },
        skip,
        take,
        include: {
          User: true,
        },
      });

      const total = await this.prisma.articles.count({ where });

      return {
        data: articles,
        meta: {
          total,
          page: Number(page),
          limit: take,
          lastPage: Math.ceil(total / take),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Articles fetch all failed!');
    }
  }

  async findOne(id: string) {
    const existingArticle = await this.prisma.articles.findFirst({
      where: { id },
    });

    if (!existingArticle) {
      throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
    }

    try {
      const article = await this.prisma.articles.findUnique({
        where: { id },
      });

      return article;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Article fetch one failed!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateArticleDto) {
    const existingArticle = await this.prisma.articles.findFirst({
      where: { id },
    });

    if (!existingArticle) {
      throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
    }

    try {
      const updated = await this.prisma.articles.update({
        where: { id },
        data,
      });

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Article update failed!', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    const existingArticle = await this.prisma.articles.findFirst({
      where: { id },
    });

    if (!existingArticle) {
      throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
    }
    try {
      const deleted = await this.prisma.articles.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Article delete failed!', HttpStatus.BAD_REQUEST);
    }
  }
}
