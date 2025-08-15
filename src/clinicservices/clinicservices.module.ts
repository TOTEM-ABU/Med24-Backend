import { Module } from '@nestjs/common';
import { ClinicservicesService } from './clinicservices.service';
import { ClinicservicesController } from './clinicservices.controller';

@Module({
  controllers: [ClinicservicesController],
  providers: [ClinicservicesService],
})
export class ClinicservicesModule {}
