import { Module } from '@nestjs/common';
import { MedicationpricesService } from './medicationprices.service';
import { MedicationpricesController } from './medicationprices.controller';

@Module({
  controllers: [MedicationpricesController],
  providers: [MedicationpricesService],
})
export class MedicationpricesModule {}
