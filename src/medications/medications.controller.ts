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
import { ApiQuery } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Roles } from 'src/tools/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/tools/guards/role/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('medications')
export class MedicationsController {
	constructor(private readonly medicationsService: MedicationsService) { }

	@Roles(Role.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(AuthGuard)
	@Post()
	create(@Body() createMedicationDto: CreateMedicationDto) {
		return this.medicationsService.create(createMedicationDto);
	}

	@Get()
	@ApiQuery({ name: 'search', required: false })
	@ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
	@ApiQuery({
		name: 'sortBy',
		required: false,
		enum: ['name', 'manufacturer', 'country', 'prescription_required', 'createdAt'],
		example: 'name',
	})
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@ApiQuery({ name: 'medicationCategoriesId', required: false, type: String })
	findAll(
		@Query('search') search?: string,
		@Query('sort') sort?: 'asc' | 'desc',
		@Query('sortBy')
		sortBy?: 'name' | 'manufacturer' | 'country' | 'prescription_required' | 'createdAt',
		@Query('page') page?: string,
		@Query('limit') limit?: string,
		@Query('medicationCategoriesId') medicationCategoriesId?: string,
	) {
		return this.medicationsService.findAll({
			search,
			sort,
			sortBy,
			page: page ? parseInt(page, 10) : 1,
			limit: limit ? parseInt(limit, 10) : 10,
			medicationCategoriesId,
		});
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.medicationsService.findOne(id);
	}

	@Roles(Role.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(AuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
		return this.medicationsService.update(id, updateMedicationDto);
	}

	@Roles(Role.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(AuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.medicationsService.remove(id);
	}
}
