import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMedicationpriceDto {
	@ApiProperty({ example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C' })
	@IsString()
	medicationsId: string;

	@ApiProperty({ example: '01J9W5S1AJ8D9X1T9Y8QZV4K2P' })
	@IsString()
	pharmaciesId: string;

	@ApiProperty({ example: 19.99 })
	@IsNumber()
	price: number;

	@ApiProperty({ example: true, required: false, default: true })
	@IsOptional()
	@IsBoolean()
	available?: boolean;
}
