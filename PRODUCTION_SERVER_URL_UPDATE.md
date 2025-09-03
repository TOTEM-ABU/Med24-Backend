# Production Server URL Update

## Overview
Updated all file upload URLs from `http://localhost:3000` to `http://45.76.94.219:3132` to use the production server for file storage and access.

## Changes Made

### 1. Controllers Updated

#### Clinics Controller (`src/clinics/clinics.controller.ts`)
- **Updated file upload URLs** for both logo and additional image uploads
- **Before**: `http://localhost:3000/uploads/clinics/${image.filename}`
- **After**: `http://45.76.94.219:3132/uploads/clinics/${image.filename}`

#### Medications Controller (`src/medications/medications.controller.ts`)
- **Updated file upload URLs** for medication image uploads
- **Before**: `http://localhost:3000/uploads/medications/${image.filename}`
- **After**: `http://45.76.94.219:3132/uploads/medications/${image.filename}`

### 2. Documentation Files Updated

Updated all documentation files to reflect the production server URL:

- ✅ `CLINICS_ADDITIONAL_IMAGE_UPDATE.md`
- ✅ `MEDICATION_IMAGE_UPLOAD.md`
- ✅ `CLINICS_IMAGE_UPLOAD.md`
- ✅ `ENHANCED_MEDICATION_API.md`
- ✅ `UPDATED_MEDICATION_API.md`
- ✅ `MEDICATION_FAQ_API.md`
- ✅ `CLINICS_YANDEX_MAPS_UPDATE.md`
- ✅ `PROMOTIONS_CERTIFICATE_CONDITIONS_UPDATE.md`
- ✅ `CLINICS_MULTIPART_FIX.md`
- ✅ `example-medication-multipart-data.md`
- ✅ `example-clinic-with-additional-image.json`

### 3. Example Files Updated

- ✅ `example-clinic-with-additional-image.json` - Updated all example URLs
- ✅ All curl examples in documentation files
- ✅ All JavaScript/Fetch examples in documentation files

## File Upload Endpoints

### Clinics Module
- **Logo Upload**: `PATCH /api/clinics/:id/image`
- **Additional Image Upload**: `PATCH /api/clinics/:id/additional-image`
- **File Storage**: `http://45.76.94.219:3132/uploads/clinics/`

### Medications Module
- **Image Upload**: `PATCH /api/medications/:id/image`
- **File Storage**: `http://45.76.94.219:3132/uploads/medications/`

## Example Usage

### Upload Clinic Logo
```bash
curl -X PATCH "http://45.76.94.219:3132/api/clinics/01J9W5S1AJ8D9X1T9Y8QZV4K2C/image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/clinic-logo.png"
```

**Response:**
```json
{
  "message": "Clinic updated successfully!",
  "data": {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "name": "Shifo Med Center",
    "logo_url": "http://45.76.94.219:3132/uploads/clinics/clinic-1234567890-logo.png",
    // ... other fields
  }
}
```

### Upload Clinic Additional Image
```bash
curl -X PATCH "http://45.76.94.219:3132/api/clinics/01J9W5S1AJ8D9X1T9Y8QZV4K2C/additional-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/clinic-additional-image.jpg"
```

**Response:**
```json
{
  "message": "Clinic updated successfully!",
  "data": {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "name": "Shifo Med Center",
    "image_url": "http://45.76.94.219:3132/uploads/clinics/additional-1234567890-image.jpg",
    // ... other fields
  }
}
```

### Upload Medication Image
```bash
curl -X PATCH "http://45.76.94.219:3132/api/medications/01J9W5S1AJ8D9X1T9Y8QZV4K2C/image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/medication-image.jpg"
```

**Response:**
```json
{
  "message": "Medication updated successfully!",
  "data": {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "name": "Magne V6",
    "image_url": "http://45.76.94.219:3132/uploads/medications/medication-1234567890-image.jpg",
    // ... other fields
  }
}
```

## Frontend Integration

### JavaScript/Fetch Examples
```javascript
// Upload clinic logo
const uploadClinicLogo = async (clinicId, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`http://45.76.94.219:3132/api/clinics/${clinicId}/image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};

// Upload clinic additional image
const uploadClinicAdditionalImage = async (clinicId, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`http://45.76.94.219:3132/api/clinics/${clinicId}/additional-image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};

// Upload medication image
const uploadMedicationImage = async (medicationId, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`http://45.76.94.219:3132/api/medications/${medicationId}/image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};
```

## File Access

### Direct File Access
Files uploaded to the production server can be accessed directly via:
- **Clinic Images**: `http://45.76.94.219:3132/uploads/clinics/{filename}`
- **Medication Images**: `http://45.76.94.219:3132/uploads/medications/{filename}`

### Example File URLs
- Clinic Logo: `http://45.76.94.219:3132/uploads/clinics/clinic-1234567890-logo.png`
- Clinic Additional Image: `http://45.76.94.219:3132/uploads/clinics/additional-1234567890-image.jpg`
- Medication Image: `http://45.76.94.219:3132/uploads/medications/medication-1234567890-image.jpg`

## Testing

### Build Status
- ✅ **Build successful** - No compilation errors
- ✅ **Linting passed** - No code quality issues
- ✅ **All controllers updated** - File upload URLs changed
- ✅ **Documentation updated** - All examples use production URL

### Verification Steps
1. **Upload a file** using any of the image upload endpoints
2. **Check the response** - `image_url` should contain `http://45.76.94.219:3132`
3. **Access the file directly** - URL should be accessible from the production server
4. **Verify in database** - Stored URLs should use the production server

## Benefits

1. **Production Ready**: All file uploads now use the production server
2. **Consistent URLs**: All file references use the same server
3. **Accessible Files**: Uploaded files are accessible from the production environment
4. **Updated Documentation**: All examples and documentation reflect the production setup

## Security Considerations

- **File Access**: Ensure the production server has proper file serving configuration
- **CORS**: Configure CORS settings for the production server if needed
- **File Permissions**: Ensure proper file permissions for uploaded files
- **Storage Limits**: Monitor disk space on the production server

## Server Configuration

Make sure the production server (`http://45.76.94.219:3132`) is configured to:
1. **Serve static files** from the `uploads/` directory
2. **Handle file uploads** with proper size limits
3. **Support CORS** if accessing from different domains
4. **Have sufficient disk space** for file storage

The production server URL update is now complete and all file uploads will be stored and accessible from `http://45.76.94.219:3132`!
