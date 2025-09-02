import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationFaqDto } from './create-medication-faq.dto';

export class UpdateMedicationFaqDto extends PartialType(CreateMedicationFaqDto) {}
