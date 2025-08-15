import { Module } from '@nestjs/common';
import { MedicationcategoriesService } from './medicationcategories.service';
import { MedicationcategoriesController } from './medicationcategories.controller';

@Module({
  controllers: [MedicationcategoriesController],
  providers: [MedicationcategoriesService],
})
export class MedicationcategoriesModule {}
