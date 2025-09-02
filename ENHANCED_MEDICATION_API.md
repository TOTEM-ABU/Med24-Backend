# Enhanced Medication API Documentation

## Overview
The medications module has been significantly enhanced to include comprehensive medication information with detailed sections for medical use, composition, pharmacodynamics, and more. The API now supports advanced filtering, sorting, and pagination with full Swagger documentation.

## New Database Fields

### Detailed Medication Information
- `instructions` - Foydalanish uchun ko'rsatmalar (Usage instructions)
- `pharmacodynamics` - Farmakodinamika (Pharmacodynamics)
- `pediatric_use` - Bolalarda foydalanish (Pediatric use)
- `pregnancy_lactation` - Homiladorlik va laktatsiya davrida foydalanish (Pregnancy and lactation use)
- `contraindications` - Kontraindikatsiyalar (Contraindications)
- `dosage` - Dozalash (Dosage)
- `side_effects` - Yon ta'sirlar (Side effects)
- `interactions` - O'zaro ta'sirlar (Drug interactions)
- `storage_conditions` - Saqlash shartlari (Storage conditions)
- `expiration_date` - Yaroqlilik muddati (Expiration date)
- `updatedAt` - Last update timestamp

## API Endpoints

### 1. Get All Medications (Enhanced)
- **Endpoint**: `GET /api/medications`
- **Method**: GET
- **Authentication**: Not required
- **Description**: Retrieve medications with advanced filtering, sorting, and pagination

#### Query Parameters:
- `search` (string, optional): Search across all medication fields
- `sort` (enum: 'asc'|'desc', optional): Sort order (default: 'asc')
- `sortBy` (enum, optional): Sort field (default: 'name')
  - Options: 'name', 'manufacturer', 'country', 'prescription_required', 'createdAt', 'updatedAt'
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `medicationCategoriesId` (string, optional): Filter by category ID
- `prescription_required` (boolean, optional): Filter by prescription requirement
- `manufacturer` (string, optional): Filter by manufacturer name
- `country` (string, optional): Filter by country of origin

#### Example Request:
```bash
GET /api/medications?search=magniy&sort=desc&sortBy=createdAt&page=1&limit=20&prescription_required=false&manufacturer=Sanofi
```

### 2. Create Medication with URL
- **Endpoint**: `POST /api/medications`
- **Method**: POST
- **Authentication**: Required (Admin role)
- **Content-Type**: `application/json`

#### Request Body:
```json
{
  "name": "MAGNE V6",
  "description": "Magniy va B6 vitamini bilan tabletkalar",
  "composition": "Magniy laktat dihidrat 470mg, Piridoksin gidroxlorid 5mg",
  "manufacturer": "Sanofi",
  "country": "Fransiya",
  "image_url": "https://example.com/image.jpg",
  "prescription_required": false,
  "medicationCategoriesId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "instructions": "Ushbu dori vositasi magniy saqlaydi...",
  "pharmacodynamics": "Magniy asosan xujayra ichki kationi hisoblanadi...",
  "pediatric_use": "Bolalarda foydalanish haqida ma'lumot...",
  "pregnancy_lactation": "Homiladorlikning yetarli sonidagi klinik tajriba...",
  "contraindications": "Ushbu preparatni quyidagi hollarda qo'llash mumkin emas...",
  "dosage": "Kattalar: 1-2 tabletka kuniga 2-3 marta...",
  "side_effects": "Yon ta'sirlar: allergik reaktsiyalar...",
  "interactions": "Boshqa dorilar bilan o'zaro ta'sirlar...",
  "storage_conditions": "Quruq joyda, bolalar qo'lidan uzoqda...",
  "expiration_date": "3 yil"
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

## Advanced Search Capabilities

The search functionality now includes all medication fields:
- Basic fields: name, description, composition, manufacturer, country
- Detailed fields: instructions, pharmacodynamics, pediatric_use, pregnancy_lactation, contraindications, dosage, side_effects, interactions, storage_conditions, expiration_date

## Filtering Options

### By Prescription Requirement
```bash
GET /api/medications?prescription_required=true
GET /api/medications?prescription_required=false
```

### By Manufacturer
```bash
GET /api/medications?manufacturer=Sanofi
```

### By Country
```bash
GET /api/medications?country=Fransiya
```

### By Category
```bash
GET /api/medications?medicationCategoriesId=01J9W5S1AJ8D9X1T9Y8QZV4K2C
```

### Combined Filters
```bash
GET /api/medications?manufacturer=Sanofi&prescription_required=false&country=Fransiya
```

## Sorting Options

### By Name
```bash
GET /api/medications?sortBy=name&sort=asc
```

### By Manufacturer
```bash
GET /api/medications?sortBy=manufacturer&sort=desc
```

### By Creation Date
```bash
GET /api/medications?sortBy=createdAt&sort=desc
```

### By Update Date
```bash
GET /api/medications?sortBy=updatedAt&sort=desc
```

## Pagination

### Basic Pagination
```bash
GET /api/medications?page=1&limit=10
```

### Large Page Size
```bash
GET /api/medications?page=1&limit=50
```

## Response Format

### Success Response (List)
```json
{
  "data": [
    {
      "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
      "name": "MAGNE V6",
      "description": "Magniy va B6 vitamini bilan tabletkalar",
      "composition": "Magniy laktat dihidrat 470mg, Piridoksin gidroxlorid 5mg",
      "manufacturer": "Sanofi",
      "country": "Fransiya",
      "image_url": "http://localhost:3000/uploads/medications/medication-1234567890-123456789-magne-v6.jpg",
      "prescription_required": false,
      "instructions": "Ushbu dori vositasi magniy saqlaydi...",
      "pharmacodynamics": "Magniy asosan xujayra ichki kationi hisoblanadi...",
      "pediatric_use": "Bolalarda foydalanish haqida ma'lumot...",
      "pregnancy_lactation": "Homiladorlikning yetarli sonidagi klinik tajriba...",
      "contraindications": "Ushbu preparatni quyidagi hollarda qo'llash mumkin emas...",
      "dosage": "Kattalar: 1-2 tabletka kuniga 2-3 marta...",
      "side_effects": "Yon ta'sirlar: allergik reaktsiyalar...",
      "interactions": "Boshqa dorilar bilan o'zaro ta'sirlar...",
      "storage_conditions": "Quruq joyda, bolalar qo'lidan uzoqda...",
      "expiration_date": "3 yil",
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

## Error Handling

- `400 Bad Request`: Invalid data or missing required fields
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have admin role
- `404 Not Found`: Medication not found
- `413 Payload Too Large`: Image file exceeds 5MB limit
- `415 Unsupported Media Type`: Invalid file type

## Swagger Documentation

Access the comprehensive API documentation at:
- Development: `http://localhost:3000/docs`

The Swagger documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Example data
- Error responses
- Authentication requirements
- File upload specifications

## Example Usage

### JavaScript/Fetch Example
```javascript
// Search medications with filters
const searchMedications = async () => {
  const params = new URLSearchParams({
    search: 'magniy',
    sort: 'desc',
    sortBy: 'createdAt',
    page: '1',
    limit: '20',
    prescription_required: 'false',
    manufacturer: 'Sanofi'
  });

  const response = await fetch(`http://localhost:3000/api/medications?${params}`);
  const data = await response.json();
  console.log(data);
};

// Create medication with detailed information
const createMedication = async () => {
  const medicationData = {
    name: "MAGNE V6",
    description: "Magniy va B6 vitamini bilan tabletkalar",
    composition: "Magniy laktat dihidrat 470mg, Piridoksin gidroxlorid 5mg",
    manufacturer: "Sanofi",
    country: "Fransiya",
    image_url: "https://example.com/image.jpg",
    prescription_required: false,
    instructions: "Ushbu dori vositasi magniy saqlaydi...",
    pharmacodynamics: "Magniy asosan xujayra ichki kationi hisoblanadi...",
    // ... other fields
  };

  const response = await fetch('http://localhost:3000/api/medications', {
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
```

### cURL Examples
```bash
# Search medications
curl -X GET "http://localhost:3000/api/medications?search=magniy&manufacturer=Sanofi&prescription_required=false"

# Create medication
curl -X POST "http://localhost:3000/api/medications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @example-medication-data.json

# Create medication with image
curl -X POST "http://localhost:3000/api/medications/with-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=MAGNE V6" \
  -F "description=Magniy va B6 vitamini bilan tabletkalar" \
  -F "composition=Magniy laktat dihidrat 470mg" \
  -F "manufacturer=Sanofi" \
  -F "country=Fransiya" \
  -F "instructions=Ushbu dori vositasi magniy saqlaydi..." \
  -F "image=@/path/to/medication-image.jpg"
```

## Database Migration

The database has been updated with new fields. The migration file `20250902094311_add_detailed_medication_info` includes:
- New optional fields for detailed medication information
- UpdatedAt timestamp field
- Proper indexing for search performance

## Performance Considerations

- Search queries are optimized with case-insensitive matching
- Pagination prevents large result sets
- Database indexes on frequently searched fields
- File upload size limits to prevent server overload
- Proper error handling for all edge cases

This enhanced medication API provides a comprehensive solution for managing detailed medication information with advanced search, filtering, and sorting capabilities, all documented with Swagger for easy integration.
