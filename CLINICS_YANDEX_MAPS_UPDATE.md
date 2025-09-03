# Clinics Yandex Maps URL Field Update

## Overview
Added a new `yandex_map_url` field to the clinics module to store Yandex Maps URLs for clinic locations. This field allows clinics to provide direct links to their location on Yandex Maps.

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
  yandex_map_url String?     // Yandex Maps URL for clinic location
  rating        Decimal      @default(0)
  type          Clinics_Type
  // ... other fields
}
```

### Migration Applied
- **Migration Name**: `20250902113738_add_yandex_map_url_to_clinics`
- **Field Type**: `String?` (optional)
- **Description**: Stores Yandex Maps URL for clinic location

## DTO Updates

### CreateClinicDto
```typescript
@ApiProperty({ 
  example: 'https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496',
  required: false,
  description: 'Yandex Maps URL for clinic location'
})
@IsString()
yandex_map_url?: string;
```

### CreateClinicWithImageDto
```typescript
@ApiProperty({ 
  example: 'https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496',
  required: false,
  description: 'Yandex Maps URL for clinic location'
})
@IsString()
yandex_map_url?: string;
```

### UpdateClinicDto
Automatically includes the `yandex_map_url` field through `PartialType(CreateClinicDto)`.

## API Usage Examples

### Creating a Clinic with Yandex Maps URL

#### Using JSON (POST /api/clinics):
```bash
curl -X POST "http://45.76.94.219:3132/api/clinics" \
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
    "logo_url": "https://cdn.med24.uz/clinic1.png",
    "yandex_map_url": "https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496",
    "type": "PRIVATE",
    "regionId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C"
  }'
```

#### Using Multipart Form Data (POST /api/clinics/with-image):
```bash
curl -X POST "http://45.76.94.219:3132/api/clinics/with-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Shifo Med Center" \
  -F "description=Zamonaviy tibbiy xizmatlar ko'rsatuvchi klinika" \
  -F "address=Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi, 12-uy" \
  -F "phone=+998971112233" \
  -F "email=info@shifomed.uz" \
  -F "website=https://shifomed.uz" \
  -F 'opening_hours={"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-20:00","sat":"09:00-18:00","sun":"10:00-16:00"}' \
  -F "yandex_map_url=https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496" \
  -F "type=PRIVATE" \
  -F "regionId=01J9W5S1AJ8D9X1T9Y8QZV4K2C" \
  -F "image=@/path/to/clinic-logo.jpg"
```

### Updating a Clinic's Yandex Maps URL

```bash
curl -X PATCH "http://45.76.94.219:3132/api/clinics/01J9W5S1AJ8D9X1T9Y8QZV4K2C" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "yandex_map_url": "https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496"
  }'
```

### JavaScript/Fetch Examples

```javascript
// Create clinic with Yandex Maps URL
const createClinicWithMap = async (clinicData, token) => {
  const response = await fetch('http://45.76.94.219:3132/api/clinics', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...clinicData,
      yandex_map_url: 'https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496'
    })
  });
  return await response.json();
};

// Update clinic's Yandex Maps URL
const updateClinicMapUrl = async (clinicId, mapUrl, token) => {
  const response = await fetch(`http://45.76.94.219:3132/api/clinics/${clinicId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ yandex_map_url: mapUrl })
  });
  return await response.json();
};
```

## Yandex Maps URL Format

### Example URL Structure:
```
https://yandex.uz/maps/10335/tashkent/?ll=69.240562%2C41.299496&z=16&l=map&mode=search&text=Shifo%20Med%20Center&sll=69.240562%2C41.299496&sspn=0.001%2C0.001&ol=geo&oll=69.240562%2C41.299496
```

### URL Parameters:
- `ll`: Longitude and latitude coordinates
- `z`: Zoom level (1-20)
- `l`: Map layer type (map, satellite, hybrid)
- `mode`: Display mode (search, route, etc.)
- `text`: Search text for the location
- `sll`: Search coordinates
- `sspn`: Search span
- `ol`: Overlay type
- `oll`: Overlay coordinates

## Frontend Integration

### Displaying Yandex Maps Link
```javascript
// In your React component
const ClinicCard = ({ clinic }) => {
  return (
    <div className="clinic-card">
      <h3>{clinic.name}</h3>
      <p>{clinic.address}</p>
      {clinic.yandex_map_url && (
        <a 
          href={clinic.yandex_map_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="map-link"
        >
          📍 Yandex Maps'da ko'rish
        </a>
      )}
    </div>
  );
};
```

### Opening Maps in New Tab
```javascript
const openInYandexMaps = (mapUrl) => {
  if (mapUrl) {
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  }
};
```

## Benefits

1. **Enhanced User Experience**: Users can easily find clinic locations
2. **Mobile Friendly**: Yandex Maps works well on mobile devices
3. **Local Integration**: Yandex Maps is popular in Uzbekistan
4. **Optional Field**: Existing clinics are not affected
5. **Flexible**: Can be updated anytime through the API

## Validation

- **Field Type**: String (optional)
- **Validation**: `@IsString()` decorator
- **Required**: No (optional field)
- **Example**: Full Yandex Maps URL with coordinates and search parameters

## Swagger Documentation

The new field is automatically documented in Swagger at `http://45.76.94.219:3132/docs` with:
- Complete API schema
- Example Yandex Maps URL
- Field description
- Validation requirements

## Testing

All existing clinic endpoints now support the `yandex_map_url` field:
- ✅ Create clinic (JSON)
- ✅ Create clinic with image (multipart)
- ✅ Update clinic
- ✅ Get clinic details
- ✅ List clinics

The field is backward compatible and doesn't break existing functionality.
