import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'EKG 20% chegirma' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Avgust aksiyasi' })
  @IsString()
  description: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  discount_percent: number;

  @ApiProperty({ 
    example: 'Sertifikat olish shartlari:\n\n20% chegirma quyidagilarga taalluqli:\n- shifokor konsultatsiyasi;\n- diagnostika.\n\n10% chegirma quyidagilarga taalluqli:\n- operatsiyalar;\n- stomatologik xizmatlar.\n\nChegirma quyidagilarga tatbiq etilmaydi:\n- dori vositalari;\n- tibbiy sarf materiallari.\n\nChegirma boshqa amaldagi aksiyalar bilan qo\'shilmaydi.',
    required: false,
    description: 'Sertifikat olish shartlari va chegirma qoidalari'
  })
  @IsOptional()
  @IsString()
  certificate_conditions?: string;

  @ApiProperty({ example: 'Clinics id' })
  @IsString()
  clinicsId: string;
}
