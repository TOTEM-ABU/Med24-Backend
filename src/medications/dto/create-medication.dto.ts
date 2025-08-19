import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMedicationDto {
	@ApiProperty({ example: 'Paracetamol' })
	@IsString()
	name: string;

	@ApiProperty({ example: 'Pain reliever and fever reducer' })
	@IsString()
	description: string;

	@ApiProperty({ example: 'Acetaminophen 500mg' })
	@IsString()
	composition: string;

	@ApiProperty({ example: 'Acme Pharma' })
	@IsString()
	manufacturer: string;

	@ApiProperty({ example: 'USA' })
	@IsString()
	country: string;

	@ApiProperty({ example: 'https://cdn.example.com/images/paracetamol.png' })
	@IsString()
	@IsUrl()
	image_url: string;

	@ApiProperty({ example: true, required: false, default: true })
	@IsOptional()
	@IsBoolean()
	prescription_required?: boolean;

	@ApiProperty({ example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C', required: false })
	@IsOptional()
	@IsString()
	medicationCategoriesId?: string;
}
