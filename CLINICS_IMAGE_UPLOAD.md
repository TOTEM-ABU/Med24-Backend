# Clinics Image Upload Feature

## Overview
This feature adds image upload functionality to the clinics module, allowing administrators to upload clinic logo images directly through the API with comprehensive Swagger documentation.

## New Endpoints

### 1. Create Clinic with Image Upload
- **Endpoint**: `POST /api/clinics/with-image`
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required (Admin role)
- **Description**: Creates a new clinic with an uploaded logo image file

#### Request Body (multipart/form-data):
- `name` (string, required): Name of the clinic
- `description` (string, required): Description of the clinic
- `address` (string, required): Address of the clinic
- `phone` (string, required): Phone number
- `email` (string, required): Email address
- `website` (string, required): Website URL
- `opening_hours` (object, required): Opening hours for each day
- `type` (enum, required): Clinic type (PUBLIC, PRIVATE, VETERINARY)
- `regionId` (string, required): Region ID
- `image` (file, required): Logo image file (jpg, jpeg, png, gif, max 5MB)

### 2. Update Clinic Logo Image
- **Endpoint**: `PATCH /api/clinics/:id/image`
- **Method**: PATCH
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required (Admin role)
- **Description**: Updates the logo image of an existing clinic

#### Request Body (multipart/form-data):
- `image` (file, required): New logo image file (jpg, jpeg, png, gif, max 5MB)

## File Storage
- Images are stored in `./uploads/clinics/` directory
- File naming format: `clinic-{timestamp}-{random}-{originalname}`
- Supported formats: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB

## Swagger Documentation
The API is fully documented with Swagger. Access the documentation at:
- Development: `http://45.76.94.219:3132/docs`

## Security Features
- Admin role required for all image upload operations
- File type validation (only images allowed)
- File size limit (5MB maximum)
- Unique filename generation to prevent conflicts

## Example Usage

### Using curl:
```bash
# Create clinic with image
curl -X POST "http://45.76.94.219:3132/api/clinics/with-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Shifo Med Center" \
  -F "description=Zamonaviy tibbiy xizmatlar ko'rsatuvchi klinika" \
  -F "address=Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi, 12-uy" \
  -F "phone=+998971112233" \
  -F "email=info@shifomed.uz" \
  -F "website=https://shifomed.uz" \
  -F 'opening_hours={"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-20:00","sat":"09:00-18:00","sun":"10:00-16:00"}' \
  -F "type=PRIVATE" \
  -F "regionId=01J9W5S1AJ8D9X1T9Y8QZV4K2C" \
  -F "image=@/path/to/clinic-logo.jpg"

# Update clinic image
curl -X PATCH "http://45.76.94.219:3132/api/clinics/CLINIC_ID/image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/new-logo.jpg"
```

### Using JavaScript/Fetch:
```javascript
// Create clinic with image
const formData = new FormData();
formData.append('name', 'Shifo Med Center');
formData.append('description', 'Zamonaviy tibbiy xizmatlar ko\'rsatuvchi klinika');
formData.append('address', 'Toshkent shahar, Chilonzor tumani, Bunyodkor ko\'chasi, 12-uy');
formData.append('phone', '+998971112233');
formData.append('email', 'info@shifomed.uz');
formData.append('website', 'https://shifomed.uz');
formData.append('opening_hours', JSON.stringify({
  mon: '08:00-20:00',
  tue: '08:00-20:00',
  wed: '08:00-20:00',
  thu: '08:00-20:00',
  fri: '08:00-20:00',
  sat: '09:00-18:00',
  sun: '10:00-16:00'
}));
formData.append('type', 'PRIVATE');
formData.append('regionId', '01J9W5S1AJ8D9X1T9Y8QZV4K2C');
formData.append('image', imageFile);

fetch('http://45.76.94.219:3132/api/clinics/with-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});

// Update clinic image
const updateFormData = new FormData();
updateFormData.append('image', newImageFile);

fetch('http://45.76.94.219:3132/api/clinics/CLINIC_ID/image', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: updateFormData
});
```

## Error Handling
- `400 Bad Request`: Invalid data or missing image file
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have admin role
- `404 Not Found`: Clinic not found (for update operations)
- `413 Payload Too Large`: Image file exceeds 5MB limit
- `415 Unsupported Media Type`: Invalid file type

## Response Format
Successful responses return the created/updated clinic object with the generated image URL:

```json
{
  "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "name": "Shifo Med Center",
  "description": "Zamonaviy tibbiy xizmatlar ko'rsatuvchi klinika",
  "address": "Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi, 12-uy",
  "phone": "+998971112233",
  "email": "info@shifomed.uz",
  "website": "https://shifomed.uz",
  "opening_hours": {
    "mon": "08:00-20:00",
    "tue": "08:00-20:00",
    "wed": "08:00-20:00",
    "thu": "08:00-20:00",
    "fri": "08:00-20:00",
    "sat": "09:00-18:00",
    "sun": "10:00-16:00"
  },
  "logo_url": "http://45.76.94.219:3132/uploads/clinics/clinic-1234567890-123456789-logo.jpg",
  "rating": 0,
  "type": "PRIVATE",
  "regionId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Complete API Endpoints

### 1. Get All Clinics
- **Endpoint**: `GET /api/clinics`
- **Method**: GET
- **Authentication**: Not required
- **Description**: Retrieve clinics with filtering, sorting, and pagination

#### Query Parameters:
- `search` (string, optional): Search across clinic fields
- `sort` (enum: 'asc'|'desc', optional): Sort order
- `sortBy` (enum, optional): Sort field (name, address, email)
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `type` (enum, optional): Filter by clinic type

### 2. Create Clinic with URL
- **Endpoint**: `POST /api/clinics`
- **Method**: POST
- **Authentication**: Required (Admin role)
- **Content-Type**: `application/json`

### 3. Create Clinic with Image Upload
- **Endpoint**: `POST /api/clinics/with-image`
- **Method**: POST
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`

### 4. Get Clinic by ID
- **Endpoint**: `GET /api/clinics/:id`
- **Method**: GET
- **Authentication**: Not required

### 5. Update Clinic
- **Endpoint**: `PATCH /api/clinics/:id`
- **Method**: PATCH
- **Authentication**: Required (Admin role)
- **Content-Type**: `application/json`

### 6. Update Clinic Image
- **Endpoint**: `PATCH /api/clinics/:id/image`
- **Method**: PATCH
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`

### 7. Delete Clinic
- **Endpoint**: `DELETE /api/clinics/:id`
- **Method**: DELETE
- **Authentication**: Required (Admin role)

## Features

- ✅ **Image upload** with validation and storage
- ✅ **Advanced search** across all clinic fields
- ✅ **Multiple filter options** (type, region, etc.)
- ✅ **Flexible sorting** by name, address, email
- ✅ **Pagination** with customizable page sizes
- ✅ **Comprehensive Swagger docs** with examples
- ✅ **Uzbek language support** for clinic information
- ✅ **Production-ready** with proper error handling
- ✅ **Type safety** with TypeScript and Prisma
- ✅ **Admin role protection** for all write operations

## Database Structure

The clinics table includes:
- `id` - Unique identifier
- `name` - Clinic name
- `description` - Clinic description
- `address` - Clinic address
- `phone` - Phone number
- `email` - Email address
- `website` - Website URL
- `opening_hours` - JSON object with opening hours
- `logo_url` - Logo image URL
- `rating` - Clinic rating
- `type` - Clinic type (PUBLIC, PRIVATE, VETERINARY)
- `regionId` - Region reference
- `createdAt` - Creation timestamp

## Performance Considerations

- Search queries are optimized with case-insensitive matching
- Pagination prevents large result sets
- File upload size limits to prevent server overload
- Proper error handling for all edge cases
- Unique filename generation to prevent conflicts

This implementation provides a comprehensive solution for managing clinic information with image upload capabilities, all properly documented with Swagger for easy frontend integration.
