# Medication Image Upload - Multipart Form Data Example

## Fixed Issue
The `prescription_required` field validation error has been fixed. When using multipart/form-data for image uploads, all form fields are received as strings, so the `prescription_required` field should be sent as a string ("true" or "false") instead of a boolean.

## Correct Usage Examples

### Using curl:
```bash
curl -X POST "http://45.76.94.219:3132/api/medications/with-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=MAGNE V6" \
  -F "description=Magniy va B6 vitamini bilan tabletkalar" \
  -F 'composition={"ingredients": "1 таблетка содержит. Ядро таблетки: активные вещества: магния лактата дигидрат* - 470 мг; пиридоксина гидрохлорид – 5 мг; вспомогательные вещества: сахароза - 115,6 мг, каолин тяжелый - 40,0 мг, акации камедь - 20,0 мг, карбоксиполиметилен 934 - 10,0 мг, тальк (магния гидросиликат) - 42,7 мг, магния стеарат - 6,7 мг. Оболочка таблетки: акации камедь - 3,615 мг, сахароза - 214,969 мг, титана диоксид - 1,416 мг, тальк (магния гидросиликат) - следы, воск карнаубский (порошок) - следы. * - эквивалентно содержанию магния (Mg++) 48 мг.", "instructions": "Ushbu dori vositasi magniy saqlaydi...", "pharmacodynamics": "Magniy asosan xujayra ichki kationi hisoblanadi...", "pediatric_use": "Bolalarda foydalanish haqida maxsus ko'\''rsatmalar mavjud...", "pregnancy_lactation": "Homiladorlikning yetarli sonidagi klinik tajriba...", "contraindications": "Ushbu preparatni quyidagi hollarda qo'\''llash mumkin emas...", "dosage": "Kattalar: 1-2 tabletka kuniga 2-3 marta...", "side_effects": "Yon ta'\''sirlar: allergik reaktsiyalar...", "interactions": "Boshqa dorilar bilan o'\''zaro ta'\''sirlar...", "storage_conditions": "Quruq joyda, bolalar qo'\''lidan uzoqda...", "expiration_date": "3 yil"}' \
  -F "manufacturer=Sanofi" \
  -F "country=Fransiya" \
  -F "prescription_required=false" \
  -F "medicationCategoriesId=01J9W5S1AJ8D9X1T9Y8QZV4K2C" \
  -F "image=@/path/to/medication-image.jpg"
```

### Using JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('name', 'MAGNE V6');
formData.append('description', 'Magniy va B6 vitamini bilan tabletkalar');
formData.append('composition', JSON.stringify({
  ingredients: "1 таблетка содержит. Ядро таблетки: активные вещества: магния лактата дигидрат* - 470 мг; пиридоксина гидрохлорид – 5 мг; вспомогательные вещества: сахароза - 115,6 мг, каолин тяжелый - 40,0 мг, акации камедь - 20,0 мг, карбоксиполиметилен 934 - 10,0 мг, тальк (магния гидросиликат) - 42,7 мг, магния стеарат - 6,7 мг. Оболочка таблетки: акации камедь - 3,615 мг, сахароза - 214,969 мг, титана диоксид - 1,416 мг, тальк (магния гидросиликат) - следы, воск карнаубский (порошок) - следы. * - эквивалентно содержанию магния (Mg++) 48 мг.",
  instructions: "Ushbu dori vositasi magniy saqlaydi. Quyidagi simptomlarning ma'lum sonini majmuasi magniyning tanqisligidan dalolat berishi mumkin: - Asabiylik, ta'sirchanlik, kuchsiz xavotirlik, o'tkinchi toliqish, uyquni biroz buzilishi, - Me'da-ichak spazmlari, yurakni tez-tez urishi (sog'lom yurakda) shaklidagi bezovtalik ko'rinishlari, - Mushak tirishishlari, sanchilish hissi. Magniyni buyurish bu simptomlarni yo'qotishga yordam berishi mumkin. Agar bir oy davolashdan keyin yaxshilanish kuzatilmasa, ushbu preparat bilan monoterapiyani davom ettirish maqsadga muvofiq emas.",
  pharmacodynamics: "Magniy asosan xujayra ichki kationi hisoblanadi. U neyronlarning qo'zg'aluvchanligini va qo'zg'alashni nerv-mushak bo'ylab o'tkazilishini pasaytiradi, Ko'pchilik fermentativ jarayonlarda ishtirok etadi. Magniy a'zolar va to'qimalarning muhim elementi hisoblanadi: suyak to'qimasida odam organizmidagi magniyning umumiy miqdorini yarmi saqlanadi.",
  pediatric_use: "Bolalarda foydalanish haqida maxsus ko'rsatmalar mavjud. Yoshga qarab dozalash o'zgaradi.",
  pregnancy_lactation: "Homiladorlikning yetarli sonidagi klinik tajriba, hech qanday fetotoksik yoki rivojlanish nuqsonlarini chaqiruvchi ta'sirini aniqlamagan. Zarurati bo'lganida magniy homiladorlikning har qanday bosqichida qo'llanishi mumkin.",
  contraindications: "Ushbu preparatni quyidagi hollarda qo'llash mumkin emas: - Preparatning komponentlaridan biriga yuqori sezuvchanlik, - Kreatinin klirenси minutiga 30 ml dan kam bo'lgan og'ir buyrak yetishmovchiligi.",
  dosage: "Kattalar: 1-2 tabletka kuniga 2-3 marta, ovqat bilan yoki ovqatdan keyin ichiladi. Bolalar: yoshga qarab dozalash o'zgaradi.",
  side_effects: "Yon ta'sirlar: allergik reaktsiyalar, me'da-ichak buzilishlari, diareya, qusish.",
  interactions: "Boshqa dorilar bilan o'zaro ta'sirlar: tetratsiklinlar, fluorokinolonlar bilan bir vaqtda qo'llanmasligi kerak.",
  storage_conditions: "Quruq joyda, bolalar qo'lidan uzoqda, 25°C dan yuqori bo'lmagan haroratda saqlang.",
  expiration_date: "3 yil"
}));
formData.append('manufacturer', 'Sanofi');
formData.append('country', 'Fransiya');
formData.append('prescription_required', 'false'); // Note: string value, not boolean
formData.append('medicationCategoriesId', '01J9W5S1AJ8D9X1T9Y8QZV4K2C');
formData.append('image', imageFile);

fetch('http://45.76.94.219:3132/api/medications/with-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});
```

## Key Changes Made

1. **DTO Update**: Changed `prescription_required` field type from `boolean` to `string` in `CreateMedicationWithImageDto`
2. **Controller Update**: Added string-to-boolean conversion in the controller
3. **Swagger Documentation**: Updated to show that `prescription_required` should be sent as a string
4. **Validation**: Updated validation to accept string values for multipart form data

## Important Notes

- When using `multipart/form-data`, all form fields are received as strings
- The `prescription_required` field should be sent as `"true"` or `"false"` (string)
- The controller automatically converts the string to a boolean before saving to the database
- This fix ensures compatibility with both JSON and multipart form data requests

## Testing

The medication image upload should now work correctly without the validation error. You can test it using the examples above or through the Swagger documentation at `http://45.76.94.219:3132/docs`.
