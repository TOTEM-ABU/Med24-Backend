import { Module } from '@nestjs/common';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';
import { ClinicsModule } from './clinics/clinics.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ServicesModule } from './services/services.module';
import { ClinicservicesModule } from './clinicservices/clinicservices.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ArticlesModule } from './articles/articles.module';
import { PromotionsModule } from './promotions/promotions.module';
import { BannersModule } from './banners/banners.module';
import { FaqModule } from './faq/faq.module';
import { ContactsModule } from './contacts/contacts.module';
import { MedicationsModule } from './medications/medications.module';
import { MedicationcategoriesModule } from './medicationcategories/medicationcategories.module';
import { MedicationpricesModule } from './medicationprices/medicationprices.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './tools/prisma/prisma.service';
import { PrismaModule } from './tools/prisma/prisma.module';

@Module({
  imports: [
    RegionModule,
    UserModule,
    ClinicsModule,
    SpecialtiesModule,
    DoctorsModule,
    ServicesModule,
    ClinicservicesModule,
    AppointmentsModule,
    ReviewsModule,
    ArticlesModule,
    PromotionsModule,
    BannersModule,
    FaqModule,
    ContactsModule,
    MedicationsModule,
    MedicationcategoriesModule,
    MedicationpricesModule,
    PharmaciesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
