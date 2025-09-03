# Medication Image Upload Feature

## Overview
This feature adds image upload functionality to the medications module, allowing administrators to upload medication images directly through the API.

## New Endpoints

### 1. Create Medication with Image Upload
- **Endpoint**: `POST /api/medications/with-image`
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required (Admin role)
- **Description**: Creates a new medication with an uploaded image file

#### Request Body (multipart/form-data):
- `name` (string, required): Name of the medication
- `description` (string, required): Description of the medication
- `composition` (string, required): Active ingredients and dosage
- `manufacturer` (string, required): Pharmaceutical company name
- `country` (string, required): Country of origin
- `prescription_required` (boolean, optional): Whether prescription is required
- `medicationCategoriesId` (string, optional): Category ID
- `image` (file, required): Image file (jpg, jpeg, png, gif, max 5MB)

### 2. Update Medication Image
- **Endpoint**: `PATCH /api/medications/:id/image`
- **Method**: PATCH
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required (Admin role)
- **Description**: Updates the image of an existing medication

#### Request Body (multipart/form-data):
- `image` (file, required): New image file (jpg, jpeg, png, gif, max 5MB)

## File Storage
- Images are stored in `./uploads/medications/` directory
- File naming format: `medication-{timestamp}-{random}-{originalname}`
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
# Create medication with image
curl -X POST "http://45.76.94.219:3132/api/medications/with-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Paracetamol" \
  -F "description=Pain reliever and fever reducer" \
  -F "composition=Acetaminophen 500mg" \
  -F "manufacturer=Acme Pharma" \
  -F "country=USA" \
  -F "prescription_required=true" \
  -F "image=@/path/to/medication-image.jpg"

# Update medication image
curl -X PATCH "http://45.76.94.219:3132/api/medications/MEDICATION_ID/image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/new-image.jpg"
```

### Using JavaScript/Fetch:
```javascript
// Create medication with image
const formData = new FormData();
formData.append('name', 'Paracetamol');
formData.append('description', 'Pain reliever and fever reducer');
formData.append('composition', 'Acetaminophen 500mg');
formData.append('manufacturer', 'Acme Pharma');
formData.append('country', 'USA');
formData.append('prescription_required', 'true');
formData.append('image', imageFile);

fetch('http://45.76.94.219:3132/api/medications/with-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});
```

## Error Handling
- `400 Bad Request`: Invalid data or missing image file
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have admin role
- `404 Not Found`: Medication not found (for update operations)
- `413 Payload Too Large`: Image file exceeds 5MB limit
- `415 Unsupported Media Type`: Invalid file type

## Response Format
Successful responses return the created/updated medication object with the generated image URL:

```json
{
  "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "name": "Paracetamol",
  "description": "Pain reliever and fever reducer",
  "composition": "Acetaminophen 500mg",
  "manufacturer": "Acme Pharma",
  "country": "USA",
  "image_url": "http://45.76.94.219:3132/uploads/medications/medication-1234567890-123456789-paracetamol.jpg",
  "prescription_required": true,
  "medicationCategoriesId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
