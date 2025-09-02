# Clinics Image Upload - Multipart Form Data Fix

## Fixed Issue
The `opening_hours` field validation error has been fixed. When using multipart/form-data for image uploads, all form fields are received as strings, so the `opening_hours` field should be sent as a JSON string instead of an object.

## Error Fixed
```
"nested property opening_hours must be either object or array"
```

## Correct Usage Examples

### Using curl:
```bash
curl -X POST "http://localhost:3000/api/clinics/with-image" \
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
```

### Using JavaScript/Fetch:
```javascript
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
})); // Note: JSON.stringify() to convert object to string
formData.append('type', 'PRIVATE');
formData.append('regionId', '01J9W5S1AJ8D9X1T9Y8QZV4K2C');
formData.append('image', imageFile);

fetch('http://localhost:3000/api/clinics/with-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});
```

## Key Changes Made

1. **DTO Update**: Changed `opening_hours` field type from `OpeningHoursDto` object to `string` in `CreateClinicWithImageDto`
2. **Controller Update**: Added JSON string-to-object conversion in the controller with proper error handling
3. **Swagger Documentation**: Updated to show that `opening_hours` should be sent as a JSON string
4. **Validation**: Updated validation to accept string values for multipart form data

## Important Notes

- When using `multipart/form-data`, all form fields are received as strings
- The `opening_hours` field should be sent as a JSON string: `'{"mon":"08:00-20:00","tue":"08:00-20:00",...}'`
- The controller automatically parses the JSON string to an object before saving to the database
- If the JSON string is invalid, the API will return a `400 Bad Request` error with message "Invalid opening_hours JSON format"
- This fix ensures compatibility with both JSON and multipart form data requests

## Opening Hours Format

The `opening_hours` field should contain a JSON object with the following structure:

```json
{
  "mon": "08:00-20:00",
  "tue": "08:00-20:00", 
  "wed": "08:00-20:00",
  "thu": "08:00-20:00",
  "fri": "08:00-20:00",
  "sat": "09:00-18:00",
  "sun": "10:00-16:00"
}
```

When sending via multipart form data, this should be converted to a string:
```javascript
const openingHoursString = JSON.stringify({
  mon: '08:00-20:00',
  tue: '08:00-20:00',
  wed: '08:00-20:00',
  thu: '08:00-20:00',
  fri: '08:00-20:00',
  sat: '09:00-18:00',
  sun: '10:00-16:00'
});
```

## Testing

The clinic image upload should now work correctly without the validation error. You can test it using the examples above or through the Swagger documentation at `http://localhost:3000/docs`.

## Error Handling

- `400 Bad Request`: Invalid opening_hours JSON format
- `400 Bad Request`: Missing image file
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have admin role
- `413 Payload Too Large`: Image file exceeds 5MB limit
- `415 Unsupported Media Type`: Invalid file type
