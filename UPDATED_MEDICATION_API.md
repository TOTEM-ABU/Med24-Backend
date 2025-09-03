# Updated Medication API Documentation

## Overview
The medications module has been updated to store all detailed medication information within a single `composition` field as a structured JSON object. This approach consolidates all medication details into one field while maintaining full search and filtering capabilities.

## Database Structure

### Medications Table
- `id` - Unique identifier
- `name` - Medication name
- `description` - Brief description
- `composition` - **Structured JSON containing all detailed information**
- `manufacturer` - Pharmaceutical company
- `country` - Country of origin
- `image_url` - Image URL
- `prescription_required` - Boolean flag
- `medicationCategoriesId` - Category reference
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Composition Field Structure

The `composition` field contains a JSON object with the following structure:

```json
{
  "ingredients": "Detailed ingredient information",
  "instructions": "Foydalanish uchun ko'rsatmalar",
  "pharmacodynamics": "Farmakodinamika",
  "pediatric_use": "Bolalarda foydalanish",
  "pregnancy_lactation": "Homiladorlik va laktatsiya davrida foydalanish",
  "contraindications": "Kontraindikatsiyalar",
  "dosage": "Dozalash",
  "side_effects": "Yon ta'sirlar",
  "interactions": "O'zaro ta'sirlar",
  "storage_conditions": "Saqlash shartlari",
  "expiration_date": "Yaroqlilik muddati"
}
```

## API Endpoints

### 1. Get All Medications
- **Endpoint**: `GET /api/medications`
- **Method**: GET
- **Authentication**: Not required

#### Query Parameters:
- `search` (string, optional): Search across all fields including composition content
- `sort` (enum: 'asc'|'desc', optional): Sort order
- `sortBy` (enum, optional): Sort field
  - Options: 'name', 'manufacturer', 'country', 'prescription_required', 'createdAt', 'updatedAt'
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `medicationCategoriesId` (string, optional): Filter by category
- `prescription_required` (boolean, optional): Filter by prescription requirement
- `manufacturer` (string, optional): Filter by manufacturer
- `country` (string, optional): Filter by country

### 2. Create Medication
- **Endpoint**: `POST /api/medications`
- **Method**: POST
- **Authentication**: Required (Admin role)
- **Content-Type**: `application/json`

#### Request Body Example:
```json
{
  "name": "MAGNE V6",
  "description": "Magniy va B6 vitamini bilan tabletkalar",
  "composition": "{\"ingredients\": \"1 таблетка содержит. Ядро таблетки: активные вещества: магния лактата дигидрат* - 470 мг; пиридоксина гидрохлорид – 5 мг; вспомогательные вещества: сахароза - 115,6 мг, каолин тяжелый - 40,0 мг, акации камедь - 20,0 мг, карбоксиполиметилен 934 - 10,0 мг, тальк (магния гидросиликат) - 42,7 мг, магния стеарат - 6,7 мг. Оболочка таблетки: акации камедь - 3,615 мг, сахароза - 214,969 мг, титана диоксид - 1,416 мг, тальк (магния гидросиликат) - следы, воск карнаубский (порошок) - следы. * - эквивалентно содержанию магния (Mg++) 48 мг.\", \"instructions\": \"Ushbu dori vositasi magniy saqlaydi. Quyidagi simptomlarning ma'lum sonini majmuasi magniyning tanqisligidan dalolat berishi mumkin: - Asabiylik, ta'sirchanlik, kuchsiz xavotirlik, o'tkinchi toliqish, uyquni biroz buzilishi, - Me'da-ichak spazmlari, yurakni tez-tez urishi (sog'lom yurakda) shaklidagi bezovtalik ko'rinishlari, - Mushak tirishishlari, sanchilish hissi. Magniyni buyurish bu simptomlarni yo'qotishga yordam berishi mumkin. Agar bir oy davolashdan keyin yaxshilanish kuzatilmasa, ushbu preparat bilan monoterapiyani davom ettirish maqsadga muvofiq emas.\", \"pharmacodynamics\": \"Magniy asosan xujayra ichki kationi hisoblanadi. U neyronlarning qo'zg'aluvchanligini va qo'zg'alashni nerv-mushak bo'ylab o'tkazilishini pasaytiradi, Ko'pchilik fermentativ jarayonlarda ishtirok etadi. Magniy a'zolar va to'qimalarning muhim elementi hisoblanadi: suyak to'qimasida odam organizmidagi magniyning umumiy miqdorini yarmi saqlanadi.\", \"pediatric_use\": \"Bolalarda foydalanish haqida maxsus ko'rsatmalar mavjud. Yoshga qarab dozalash o'zgaradi.\", \"pregnancy_lactation\": \"Homiladorlikning yetarli sonidagi klinik tajriba, hech qanday fetotoksik yoki rivojlanish nuqsonlarini chaqiruvchi ta'sirini aniqlamagan. Zarurati bo'lganida magniy homiladorlikning har qanday bosqichida qo'llanishi mumkin.\", \"contraindications\": \"Ushbu preparatni quyidagi hollarda qo'llash mumkin emas: - Preparatning komponentlaridan biriga yuqori sezuvchanlik, - Kreatinin klirenси minutiga 30 ml dan kam bo'lgan og'ir buyrak yetishmovchiligi.\", \"dosage\": \"Kattalar: 1-2 tabletka kuniga 2-3 marta, ovqat bilan yoki ovqatdan keyin ichiladi. Bolalar: yoshga qarab dozalash o'zgaradi.\", \"side_effects\": \"Yon ta'sirlar: allergik reaktsiyalar, me'da-ichak buzilishlari, diareya, qusish.\", \"interactions\": \"Boshqa dorilar bilan o'zaro ta'sirlar: tetratsiklinlar, fluorokinolonlar bilan bir vaqtda qo'llanmasligi kerak.\", \"storage_conditions\": \"Quruq joyda, bolalar qo'lidan uzoqda, 25°C dan yuqori bo'lmagan haroratda saqlang.\", \"expiration_date\": \"3 yil\"}",
  "manufacturer": "Sanofi",
  "country": "Fransiya",
  "prescription_required": false,
  "medicationCategoriesId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C"
}
```

### 3. Create Medication with Image Upload
- **Endpoint**: `POST /api/medications/with-image`
- **Method**: POST
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`

#### Request Body (multipart/form-data):
All fields from the JSON endpoint plus:
- `image` (file, required): Image file (jpg, jpeg, png, gif, max 5MB)

### 4. Get Medication by ID
- **Endpoint**: `GET /api/medications/:id`
- **Method**: GET
- **Authentication**: Not required

### 5. Update Medication
- **Endpoint**: `PATCH /api/medications/:id`
- **Method**: PATCH
- **Authentication**: Required (Admin role)
- **Content-Type**: `application/json`

### 6. Update Medication Image
- **Endpoint**: `PATCH /api/medications/:id/image`
- **Method**: PATCH
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`

### 7. Delete Medication
- **Endpoint**: `DELETE /api/medications/:id`
- **Method**: DELETE
- **Authentication**: Required (Admin role)

## Search Capabilities

The search functionality now searches within the composition JSON content, allowing users to find medications by:
- Basic fields: name, description, manufacturer, country
- Composition content: All detailed information stored in the JSON structure

## Response Format

### Success Response (List)
```json
{
  "data": [
    {
      "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
      "name": "MAGNE V6",
      "description": "Magniy va B6 vitamini bilan tabletkalar",
      "composition": "{\"ingredients\": \"1 таблетка содержит...\", \"instructions\": \"Ushbu dori vositasi magniy saqlaydi...\", \"pharmacodynamics\": \"Magniy asosan xujayra ichki kationi hisoblanadi...\", \"pediatric_use\": \"Bolalarda foydalanish haqida maxsus ko'rsatmalar mavjud...\", \"pregnancy_lactation\": \"Homiladorlikning yetarli sonidagi klinik tajriba...\", \"contraindications\": \"Ushbu preparatni quyidagi hollarda qo'llash mumkin emas...\", \"dosage\": \"Kattalar: 1-2 tabletka kuniga 2-3 marta...\", \"side_effects\": \"Yon ta'sirlar: allergik reaktsiyalar...\", \"interactions\": \"Boshqa dorilar bilan o'zaro ta'sirlar...\", \"storage_conditions\": \"Quruq joyda, bolalar qo'lidan uzoqda...\", \"expiration_date\": \"3 yil\"}",
      "manufacturer": "Sanofi",
      "country": "Fransiya",
      "image_url": "http://45.76.94.219:3132/uploads/medications/medication-1234567890-123456789-magne-v6.jpg",
      "prescription_required": false,
      "medicationCategoriesId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
      "MedicationCategories": {
        "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
        "name": "Vitaminlar va mineralar",
        "description": "Vitamin va mineral preparatlari"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "lastPage": 1
}
```

## Example Usage

### JavaScript/Fetch Example
```javascript
// Create medication with structured composition
const createMedication = async () => {
  const compositionData = {
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
  };

  const medicationData = {
    name: "MAGNE V6",
    description: "Magniy va B6 vitamini bilan tabletkalar",
    composition: JSON.stringify(compositionData),
    manufacturer: "Sanofi",
    country: "Fransiya",
    prescription_required: false
  };

  const response = await fetch('http://45.76.94.219:3132/api/medications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify(medicationData)
  });

  const result = await response.json();
  console.log(result);
};

// Parse composition data when retrieving
const getMedication = async (id) => {
  const response = await fetch(`http://45.76.94.219:3132/api/medications/${id}`);
  const medication = await response.json();
  
  // Parse the composition JSON
  const composition = JSON.parse(medication.composition);
  console.log('Ingredients:', composition.ingredients);
  console.log('Instructions:', composition.instructions);
  console.log('Dosage:', composition.dosage);
  
  return { ...medication, composition };
};
```

### cURL Examples
```bash
# Create medication with structured composition
curl -X POST "http://45.76.94.219:3132/api/medications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @example-medication-data.json

# Search medications (searches within composition content)
curl -X GET "http://45.76.94.219:3132/api/medications?search=magniy&manufacturer=Sanofi"

# Get medication and parse composition
curl -X GET "http://45.76.94.219:3132/api/medications/MEDICATION_ID"
```

## Benefits of This Approach

1. **Consolidated Storage**: All medication information is stored in one field
2. **Flexible Structure**: Easy to add new fields to the composition JSON
3. **Search Capability**: Full-text search works across all composition content
4. **Backward Compatibility**: Existing API endpoints remain unchanged
5. **Easy Parsing**: Frontend can easily parse and display structured data
6. **Maintainable**: Single field to manage instead of multiple separate fields

## Database Migration

The database has been updated with the migration `20250902094805_remove_separate_medication_fields` which:
- Removed separate fields for detailed medication information
- Kept the composition field to store structured JSON data
- Maintained all existing functionality

## Swagger Documentation

Access the updated API documentation at:
- Development: `http://45.76.94.219:3132/docs`

The Swagger documentation includes:
- Updated composition field examples
- Structured JSON format examples
- All existing endpoint documentation
- File upload specifications

This updated approach provides a cleaner, more maintainable structure while preserving all the detailed medication information and search capabilities.
