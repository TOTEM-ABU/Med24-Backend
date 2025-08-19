import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Controller('medications')
export class MedicationsController {
	constructor(private readonly medicationsService: MedicationsService) {}

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

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
		return this.medicationsService.update(id, updateMedicationDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.medicationsService.remove(id);
	}
}
