# Clinics Additional Image URL Field Update

## Overview
Added a new `image_url` field to the clinics module alongside the existing `logo_url` field. This allows clinics to have both a logo and additional images that can be uploaded, updated, and deleted independently.

## Database Schema Changes

### Updated Clinics Model
```prisma
model Clinics {
  id            String       @id @default(ulid())
  name          String
  description   String
  address       String
  phone         String
  email         String
  website       String
  opening_hours Json //{"mon":"08:00-20:00","tue":"08:00-20:00"}
  logo_url      String
  image_url     String?      // Additional clinic image URL
  yandex_map_url String?     // Yandex Maps URL for clinic location
  rating        Decimal      @default(0)
  type          Clinics_Type
  // ... other fields
}
```

### Migration Applied
- **Migration Name**: `20250902122903_add_image_url_to_clinics`
- **Field Type**: `String?` (optional)
- **Description**: Stores additional clinic image URL

## DTO Updates

### CreateClinicDto
```typescript
@ApiProperty({ 
  example: 'https://cdn.med24.uz/clinic1-image.jpg',
  required: false,
  description: 'Additional clinic image URL'
})
@IsString()
image_url?: string;
```

### CreateClinicWithImageDto
```typescript
@ApiProperty({ 
  example: 'https://cdn.med24.uz/clinic1-image.jpg',
  required: false,
  description: 'Additional clinic image URL'
})
@IsString()
image_url?: string;
```

### UpdateClinicDto
Automatically includes the `image_url` field through `PartialType(CreateClinicDto)`.

## New API Endpoints

### 1. Update Clinic Additional Image
**PATCH** `/api/clinics/:id/additional-image`

Updates the additional image for a specific clinic. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data`

**Request Body:**
- `image` (file): Image file (jpg, jpeg, png, gif)
- Maximum file size: 5MB

**Response:**
```json
{
  "message": "Clinic updated successfully!",
  "data": {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "name": "Shifo Med Center",
    "logo_url": "http://localhost:3000/uploads/clinics/clinic-1234567890-logo.png",
    "image_url": "http://localhost:3000/uploads/clinics/additional-1234567890-image.jpg",
    // ... other fields
  }
}
```

### 2. Delete Clinic Additional Image
**DELETE** `/api/clinics/:id/additional-image`

Removes the additional image from a specific clinic. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:**
```json
{
  "message": "Clinic updated successfully!",
  "data": {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "name": "Shifo Med Center",
    "logo_url": "http://localhost:3000/uploads/clinics/clinic-1234567890-logo.png",
    "image_url": null,
    // ... other fields
  }
}
```

## API Usage Examples

### Update Clinic Additional Image

#### Using curl:
```bash
curl -X PATCH "http://localhost:3000/api/clinics/01J9W5S1AJ8D9X1T9Y8QZV4K2C/additional-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/clinic-additional-image.jpg"
```

#### Using JavaScript/Fetch:
```javascript
const updateClinicAdditionalImage = async (clinicId, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`http://localhost:3000/api/clinics/${clinicId}/additional-image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};
```

### Delete Clinic Additional Image

#### Using curl:
```bash
curl -X DELETE "http://localhost:3000/api/clinics/01J9W5S1AJ8D9X1T9Y8QZV4K2C/additional-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Using JavaScript/Fetch:
```javascript
const deleteClinicAdditionalImage = async (clinicId, token) => {
  const response = await fetch(`http://localhost:3000/api/clinics/${clinicId}/additional-image`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

### Create Clinic with Both Logo and Additional Image

#### Using JSON (POST /api/clinics):
```bash
curl -X POST "http://localhost:3000/api/clinics" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shifo Med Center",
    "description": "Zamonaviy tibbiy xizmatlar ko'\''rsatuvchi klinika",
    "address": "Toshkent shahar, Chilonzor tumani, Bunyodkor ko'\''chasi, 12-uy",
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
    "logo_url": "https://cdn.med24.uz/clinic1-logo.png",
    "image_url": "https://cdn.med24.uz/clinic1-image.jpg",
    "yandex_map_url": "https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496",
    "type": "PRIVATE",
    "regionId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C"
  }'
```

## File Upload Configuration

### Multer Configuration
- **Destination**: `./uploads/clinics/`
- **File Naming**: `additional-{timestamp}-{random}-{originalname}`
- **File Types**: jpg, jpeg, png, gif
- **File Size Limit**: 5MB
- **Storage**: Local disk storage

### File Naming Convention
- **Logo files**: `clinic-{timestamp}-{originalname}`
- **Additional image files**: `additional-{timestamp}-{originalname}`

## Frontend Integration

### Displaying Both Logo and Additional Image
```javascript
// In your React component
const ClinicCard = ({ clinic }) => {
  return (
    <div className="clinic-card">
      <div className="clinic-images">
        {clinic.logo_url && (
          <img 
            src={clinic.logo_url} 
            alt={`${clinic.name} logo`}
            className="clinic-logo"
          />
        )}
        {clinic.image_url && (
          <img 
            src={clinic.image_url} 
            alt={`${clinic.name} image`}
            className="clinic-image"
          />
        )}
      </div>
      <h3>{clinic.name}</h3>
      <p>{clinic.description}</p>
      <p>{clinic.address}</p>
    </div>
  );
};
```

### Image Upload Component
```javascript
const ClinicImageUpload = ({ clinicId, token, onSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`http://localhost:3000/api/clinics/${clinicId}/image`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      onSuccess(result);
    } catch (error) {
      console.error('Logo upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`http://localhost:3000/api/clinics/${clinicId}/additional-image`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await response.json();
      onSuccess(result);
    } catch (error) {
      console.error('Additional image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-section">
      <div className="logo-upload">
        <h4>Clinic Logo</h4>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleLogoUpload(e.target.files[0])}
          disabled={uploading}
        />
      </div>
      
      <div className="additional-image-upload">
        <h4>Additional Image</h4>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleAdditionalImageUpload(e.target.files[0])}
          disabled={uploading}
        />
      </div>
    </div>
  );
};
```

## Styling Examples

```css
.clinic-images {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.clinic-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.clinic-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.image-upload-section {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.logo-upload,
.additional-image-upload {
  flex: 1;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.logo-upload h4,
.additional-image-upload h4 {
  margin-bottom: 0.5rem;
  color: #495057;
}
```

## Benefits

1. **Flexibility**: Clinics can have both a logo and additional images
2. **Independent Management**: Logo and additional images can be managed separately
3. **Better Presentation**: More visual content for clinic profiles
4. **User Experience**: Enhanced visual appeal for clinic listings
5. **Backward Compatibility**: Existing clinics with only logo_url continue to work

## Validation

- **Field Type**: String (optional)
- **Validation**: `@IsString()` decorator
- **Required**: No (optional field)
- **File Types**: jpg, jpeg, png, gif
- **File Size**: Maximum 5MB
- **Storage**: Local disk storage in `./uploads/clinics/`

## Error Handling

### Common Error Responses:
- **400 Bad Request**: Invalid file type or file too large
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have admin role
- **404 Not Found**: Clinic not found

### Example Error Response:
```json
{
  "message": "Only image files are allowed!",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Security

- **Read Operations**: Public access (no authentication required)
- **Write Operations**: Admin role required
- **Authentication**: JWT token required for admin operations
- **Authorization**: Role-based access control using `RoleGuard`
- **File Validation**: Only image files allowed
- **File Size Limits**: 5MB maximum per file

## Swagger Documentation

The new endpoints are automatically documented in Swagger at `http://localhost:3000/docs` with:
- Complete API schema
- File upload specifications
- Request/response examples
- Authentication requirements
- Error response codes

## Testing

All existing clinic endpoints now support the `image_url` field:
- ✅ Create clinic (JSON)
- ✅ Create clinic with image (multipart)
- ✅ Update clinic
- ✅ Get clinic details
- ✅ List clinics
- ✅ Update clinic logo image
- ✅ **NEW**: Update clinic additional image
- ✅ **NEW**: Delete clinic additional image
- ✅ Delete clinic

The field is backward compatible and doesn't break existing functionality.

## File Management

### Directory Structure
```
uploads/
└── clinics/
    ├── clinic-1234567890-logo.png
    ├── additional-1234567890-image.jpg
    └── additional-1234567891-gallery.jpg
```

### File Cleanup
Consider implementing file cleanup for deleted images to prevent storage bloat:
- Remove files from disk when `image_url` is set to null
- Implement periodic cleanup of orphaned files
- Add file size monitoring

The additional image functionality is now fully integrated into the clinics module and ready for use!
