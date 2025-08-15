import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationcategoryDto } from './create-medicationcategory.dto';

export class UpdateMedicationcategoryDto extends PartialType(CreateMedicationcategoryDto) {}
