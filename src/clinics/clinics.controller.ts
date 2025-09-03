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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiQuery, ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { CreateClinicWithImageDto } from './dto/create-clinic-with-image.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { Clinics_Type, Role } from '@prisma/client';
import { diskStorage } from 'multer';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create clinic with URL' })
  @ApiResponse({ status: 201, description: 'Clinic created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() data: CreateClinicDto) {
    return this.clinicsService.create(data);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('with-image')
  @ApiOperation({ summary: 'Create clinic with image upload' })
  @ApiResponse({ status: 201, description: 'Clinic created successfully with image' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or missing image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Shifo Med Center' },
        description: { type: 'string', example: 'Zamonaviy klinika' },
        address: { type: 'string', example: 'Toshkent, Chilonzor' },
        phone: { type: 'string', example: '+998971112233' },
        email: { type: 'string', example: 'info@shifomed.uz' },
        website: { type: 'string', example: 'https://shifomed.uz' },
        opening_hours: { 
          type: 'object', 
          example: {
            mon: '08:00-20:00',
            tue: '08:00-20:00',
            wed: '08:00-20:00',
            thu: '08:00-20:00',
            fri: '08:00-20:00',
            sat: '09:00-18:00',
            sun: '10:00-16:00'
          }
        },
        type: { type: 'string', enum: ['PUBLIC', 'PRIVATE', 'VETERINARY'], example: 'PUBLIC' },
        regionId: { type: 'string', example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Clinic logo image file',
        },
      },
      required: ['name', 'description', 'address', 'phone', 'email', 'website', 'opening_hours', 'type', 'regionId', 'image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/clinics',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `clinic-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  createWithImage(
    @Body() createClinicDto: CreateClinicWithImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required!');
    }
    
    const imageUrl = `http://45.76.94.219:3132/uploads/clinics/${image.filename}`;
    
    // Convert string JSON to object for multipart form data
    let openingHours;
    try {
      openingHours = JSON.parse(createClinicDto.opening_hours);
    } catch (error) {
      throw new BadRequestException('Invalid opening_hours JSON format');
    }
    
    const clinicData = {
      ...createClinicDto,
      logo_url: imageUrl,
      opening_hours: openingHours,
    };
    
    return this.clinicsService.create(clinicData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinics with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Clinics retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for clinic name, address, phone, email, website, or opening hours' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'address', 'email'],
    example: 'name',
    description: 'Field to sort by',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'type', required: false, enum: Clinics_Type, description: 'Filter by clinic type' })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: 'name' | 'address' | 'email',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: Clinics_Type,
  ) {
    return this.clinicsService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      type,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic by ID' })
  @ApiResponse({ status: 200, description: 'Clinic retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update clinic' })
  @ApiResponse({ status: 200, description: 'Clinic updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  update(@Param('id') id: string, @Body() data: UpdateClinicDto) {
    return this.clinicsService.update(id, data);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/image')
  @ApiOperation({ summary: 'Update clinic logo image' })
  @ApiResponse({ status: 200, description: 'Clinic image updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or missing image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'New clinic logo image file',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/clinics',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `clinic-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  updateImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required!');
    }
    
    const imageUrl = `http://45.76.94.219:3132/uploads/clinics/${image.filename}`;
    
    return this.clinicsService.update(id, { logo_url: imageUrl });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/additional-image')
  @ApiOperation({ summary: 'Update clinic additional image' })
  @ApiResponse({ status: 200, description: 'Clinic additional image updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Clinic additional image file',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/clinics',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `additional-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  updateAdditionalImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required!');
    }
    
    const imageUrl = `http://45.76.94.219:3132/uploads/clinics/${image.filename}`;
    
    return this.clinicsService.update(id, { image_url: imageUrl });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id/additional-image')
  @ApiOperation({ summary: 'Delete clinic additional image' })
  @ApiResponse({ status: 200, description: 'Clinic additional image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  deleteAdditionalImage(@Param('id') id: string) {
    return this.clinicsService.update(id, { image_url: undefined });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete clinic' })
  @ApiResponse({ status: 200, description: 'Clinic deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(id);
  }
}
