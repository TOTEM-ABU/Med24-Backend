import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationpriceDto } from './create-medicationprice.dto';

export class UpdateMedicationpriceDto extends PartialType(CreateMedicationpriceDto) {}
