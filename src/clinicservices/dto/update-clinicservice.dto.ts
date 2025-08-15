import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicserviceDto } from './create-clinicservice.dto';

export class UpdateClinicserviceDto extends PartialType(CreateClinicserviceDto) {}
