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
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateMedicationWithImageDto } from './dto/create-medication-with-image.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateMedicationFaqDto } from './dto/create-medication-faq.dto';
import { UpdateMedicationFaqDto } from './dto/update-medication-faq.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from 'src/tools/guards/auth/auth.guard';
import { diskStorage } from 'multer';

@ApiTags('Medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create medication with URL' })
  @ApiResponse({ status: 201, description: 'Medication created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('with-image')
  @ApiOperation({ summary: 'Create medication with image upload' })
  @ApiResponse({ status: 201, description: 'Medication created successfully with image' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or missing image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'MAGNE V6' },
        description: { type: 'string', example: 'Magniy va B6 vitamini bilan tabletkalar' },
        composition: { type: 'string', example: '{"ingredients": "1 таблетка содержит. Ядро таблетки: активные вещества: магния лактата дигидрат* - 470 мг; пиридоксина гидрохлорид – 5 мг; вспомогательные вещества: сахароза - 115,6 мг, каолин тяжелый - 40,0 мг, акации камедь - 20,0 мг, карбоксиполиметилен 934 - 10,0 мг, тальк (магния гидросиликат) - 42,7 мг, магния стеарат - 6,7 мг. Оболочка таблетки: акации камедь - 3,615 мг, сахароза - 214,969 мг, титана диоксид - 1,416 мг, тальк (магния гидросиликат) - следы, воск карнаубский (порошок) - следы. * - эквивалентно содержанию магния (Mg++) 48 мг.", "instructions": "Ushbu dori vositasi magniy saqlaydi...", "pharmacodynamics": "Magniy asosan xujayra ichki kationi hisoblanadi...", "pediatric_use": "Bolalarda foydalanish haqida ma\'lumot...", "pregnancy_lactation": "Homiladorlikning yetarli sonidagi klinik tajriba...", "contraindications": "Ushbu preparatni quyidagi hollarda qo\'llash mumkin emas...", "dosage": "Kattalar: 1-2 tabletka kuniga 2-3 marta...", "side_effects": "Yon ta\'sirlar: allergik reaktsiyalar...", "interactions": "Boshqa dorilar bilan o\'zaro ta\'sirlar...", "storage_conditions": "Quruq joyda, bolalar qo\'lidan uzoqda...", "expiration_date": "3 yil"}' },
        manufacturer: { type: 'string', example: 'Sanofi' },
        country: { type: 'string', example: 'Fransiya' },
        prescription_required: { type: 'string', example: 'false', description: 'Whether prescription is required ("true" or "false")' },
        medicationCategoriesId: { type: 'string', example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Medication image file',
        },
      },
      required: ['name', 'description', 'composition', 'manufacturer', 'country', 'image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/medications',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `medication-${uniqueSuffix}-${file.originalname}`);
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
    @Body() createMedicationDto: CreateMedicationWithImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required!');
    }
    
    const imageUrl = `http://45.76.94.219:3132/uploads/medications/${image.filename}`;
    
    // Convert string boolean to actual boolean for multipart form data
    const medicationData = {
      ...createMedicationDto,
      image_url: imageUrl,
      prescription_required: createMedicationDto.prescription_required === 'true',
    };
    
    return this.medicationsService.create(medicationData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medications with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Medications retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for medication name, description, composition (includes all detailed info), manufacturer, or country' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [
      'name',
      'manufacturer',
      'country',
      'prescription_required',
      'createdAt',
      'updatedAt',
    ],
    example: 'name',
    description: 'Field to sort by',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'medicationCategoriesId', required: false, type: String, description: 'Filter by medication category ID' })
  @ApiQuery({ name: 'prescription_required', required: false, type: Boolean, description: 'Filter by prescription requirement (true/false)' })
  @ApiQuery({ name: 'manufacturer', required: false, type: String, description: 'Filter by manufacturer name' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Filter by country of origin' })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy')
    sortBy?:
      | 'name'
      | 'manufacturer'
      | 'country'
      | 'prescription_required'
      | 'createdAt'
      | 'updatedAt',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('medicationCategoriesId') medicationCategoriesId?: string,
    @Query('prescription_required') prescription_required?: string,
    @Query('manufacturer') manufacturer?: string,
    @Query('country') country?: string,
  ) {
    return this.medicationsService.findAll({
      search,
      sort,
      sortBy,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      medicationCategoriesId,
      prescription_required: prescription_required ? prescription_required === 'true' : undefined,
      manufacturer,
      country,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medication by ID' })
  @ApiResponse({ status: 200, description: 'Medication retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  findOne(@Param('id') id: string) {
    return this.medicationsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update medication' })
  @ApiResponse({ status: 200, description: 'Medication updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, updateMedicationDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/image')
  @ApiOperation({ summary: 'Update medication image' })
  @ApiResponse({ status: 200, description: 'Medication image updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or missing image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'New medication image file',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/medications',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `medication-${uniqueSuffix}-${file.originalname}`);
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
    
    const imageUrl = `http://45.76.94.219:3132/uploads/medications/${image.filename}`;
    
    return this.medicationsService.update(id, { image_url: imageUrl });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete medication' })
  @ApiResponse({ status: 200, description: 'Medication deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  remove(@Param('id') id: string) {
    return this.medicationsService.remove(id);
  }

  // FAQ Endpoints for Medications

  @Get(':id/faqs')
  @ApiOperation({ summary: 'Get FAQs for a specific medication' })
  @ApiResponse({ status: 200, description: 'FAQs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  getMedicationFaqs(@Param('id') id: string) {
    return this.medicationsService.getMedicationFaqs(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post(':id/faqs')
  @ApiOperation({ summary: 'Add FAQ to a medication' })
  @ApiResponse({ status: 201, description: 'FAQ added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  addMedicationFaq(
    @Param('id') medicationId: string,
    @Body() createFaqDto: CreateMedicationFaqDto,
  ) {
    return this.medicationsService.addMedicationFaq(medicationId, createFaqDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':medicationId/faqs/:faqId')
  @ApiOperation({ summary: 'Update a medication FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  updateMedicationFaq(
    @Param('medicationId') medicationId: string,
    @Param('faqId') faqId: string,
    @Body() updateFaqDto: UpdateMedicationFaqDto,
  ) {
    return this.medicationsService.updateMedicationFaq(medicationId, faqId, updateFaqDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':medicationId/faqs/:faqId')
  @ApiOperation({ summary: 'Delete a medication FAQ' })
  @ApiResponse({ status: 200, description: 'FAQ deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  removeMedicationFaq(
    @Param('medicationId') medicationId: string,
    @Param('faqId') faqId: string,
  ) {
    return this.medicationsService.removeMedicationFaq(medicationId, faqId);
  }
}
