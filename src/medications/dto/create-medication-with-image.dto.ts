import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMedicationWithImageDto {
  @ApiProperty({
    example: 'Paracetamol',
    description: 'Name of the medication',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Pain reliever and fever reducer',
    description: 'Description of the medication and its uses',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example:
      '{"ingredients": "1 таблетка содержит. Ядро таблетки: активные вещества: магния лактата дигидрат* - 470 мг; пиридоксина гидрохлорид – 5 мг; вспомогательные вещества: сахароза - 115,6 мг, каолин тяжелый - 40,0 мг, акации камедь - 20,0 мг, карбоксиполиметилен 934 - 10,0 мг, тальк (магния гидросиликат) - 42,7 мг, магния стеарат - 6,7 мг. Оболочка таблетки: акации камедь - 3,615 мг, сахароза - 214,969 мг, титана диоксид - 1,416 мг, тальк (магния гидросиликат) - следы, воск карнаубский (порошок) - следы. * - эквивалентно содержанию магния (Mg++) 48 мг.", "instructions": "Ushbu dori vositasi magniy saqlaydi. Quyidagi simptomlarning ma\'lum sonini majmuasi magniyning tanqisligidan dalolat berishi mumkin: - Asabiylik, ta\'sirchanlik, kuchsiz xavotirlik, o\'tkinchi toliqish, uyquni biroz buzilishi, - Me\'da-ichak spazmlari, yurakni tez-tez urishi (sog\'lom yurakda) shaklidagi bezovtalik ko\'rinishlari, - Mushak tirishishlari, sanchilish hissi. Magniyni buyurish bu simptomlarni yo\'qotishga yordam berishi mumkin. Agar bir oy davolashdan keyin yaxshilanish kuzatilmasa, ushbu preparat bilan monoterapiyani davom ettirish maqsadga muvofiq emas.", "pharmacodynamics": "Magniy asosan xujayra ichki kationi hisoblanadi. U neyronlarning qo\'zg\'aluvchanligini va qo\'zg\'alashni nerv-mushak bo\'ylab o\'tkazilishini pasaytiradi, Ko\'pchilik fermentativ jarayonlarda ishtirok etadi. Magniy a\'zolar va to\'qimalarning muhim elementi hisoblanadi: suyak to\'qimasida odam organizmidagi magniyning umumiy miqdorini yarmi saqlanadi.", "pediatric_use": "Bolalarda foydalanish haqida maxsus ko\'rsatmalar mavjud. Yoshga qarab dozalash o\'zgaradi.", "pregnancy_lactation": "Homiladorlikning yetarli sonidagi klinik tajriba, hech qanday fetotoksik yoki rivojlanish nuqsonlarini chaqiruvchi ta\'sirini aniqlamagan. Zarurati bo\'lganida magniy homiladorlikning har qanday bosqichida qo\'llanishi mumkin.", "contraindications": "Ushbu preparatni quyidagi hollarda qo\'llash mumkin emas: - Preparatning komponentlaridan biriga yuqori sezuvchanlik, - Kreatinin klirenси minutiga 30 ml dan kam bo\'lgan og\'ir buyrak yetishmovchiligi.", "dosage": "Kattalar: 1-2 tabletka kuniga 2-3 marta, ovqat bilan yoki ovqatdan keyin ichiladi. Bolalar: yoshga qarab dozalash o\'zgaradi.", "side_effects": "Yon ta\'sirlar: allergik reaktsiyalar, me\'da-ichak buzilishlari, diareya, qusish.", "interactions": "Boshqa dorilar bilan o\'zaro ta\'sirlar: tetratsiklinlar, fluorokinolonlar bilan bir vaqtda qo\'llanmasligi kerak.", "storage_conditions": "Quruq joyda, bolalar qo\'lidan uzoqda, 25°C dan yuqori bo\'lmagan haroratda saqlang.", "expiration_date": "3 yil"}',
    description:
      'Structured medication information including ingredients, instructions, pharmacodynamics, pediatric use, pregnancy/lactation, contraindications, dosage, side effects, interactions, storage conditions, and expiration date',
  })
  @IsString()
  composition: string;

  @ApiProperty({
    example: 'Acme Pharma',
    description: 'Name of the pharmaceutical company',
  })
  @IsString()
  manufacturer: string;

  @ApiProperty({
    example: 'USA',
    description: 'Country of origin',
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: 'true',
    required: false,
    default: 'true',
    description: 'Whether a prescription is required for this medication (string: "true" or "false")',
  })
  @IsOptional()
  @IsString()
  prescription_required?: string;

  @ApiProperty({
    example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C',
    required: false,
    description: 'ID of the medication category',
  })
  @IsOptional()
  @IsString()
  medicationCategoriesId?: string;
}
