import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateMedicationFaqDto {
  @ApiProperty({ 
    example: 'Зарегистрирован ли препарат MAGNE V6 tabletkalar крем в реестре препаратов Узбекистана?',
    description: 'Question about the medication'
  })
  @IsString()
  question: string;

  @ApiProperty({ 
    example: 'Да, препарат зарегистирован в реестре препаратов Узбекистана.',
    description: 'Answer to the question'
  })
  @IsString()
  answer: string;

  @ApiProperty({ 
    example: '01J9W5S1AJ8D9X1T9Y8QZV4K2C',
    required: false,
    description: 'ID of the medication this FAQ belongs to'
  })
  @IsOptional()
  @IsString()
  medicationId?: string;
}
