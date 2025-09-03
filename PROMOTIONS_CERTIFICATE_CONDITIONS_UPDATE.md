# Promotions Certificate Conditions Field Update

## Overview
Added a new `certificate_conditions` field to the promotions module to store detailed certificate discount terms and conditions for medical services. This field allows promotions to specify exactly which services are eligible for discounts and under what conditions.

## Database Schema Changes

### Updated Promotions Model
```prisma
model Promotions {
  id               String @id @default(ulid())
  title            String
  description      String
  discount_percent Int
  certificate_conditions String? // Sertifikat olish shartlari va chegirma qoidalari

  clinicsId String?
  Clinics   Clinics? @relation(fields: [clinicsId], references: [id])

  createdAt DateTime @default(now())
}
```

### Migration Applied
- **Migration Name**: `20250902114742_add_certificate_conditions_to_promotions`
- **Field Type**: `String?` (optional)
- **Description**: Stores certificate discount terms and conditions

## DTO Updates

### CreatePromotionDto
```typescript
@ApiProperty({ 
  example: 'Sertifikat olish shartlari:\n\n20% chegirma quyidagilarga taalluqli:\n- shifokor konsultatsiyasi;\n- diagnostika.\n\n10% chegirma quyidagilarga taalluqli:\n- operatsiyalar;\n- stomatologik xizmatlar.\n\nChegirma quyidagilarga tatbiq etilmaydi:\n- dori vositalari;\n- tibbiy sarf materiallari.\n\nChegirma boshqa amaldagi aksiyalar bilan qo\'shilmaydi.',
  required: false,
  description: 'Sertifikat olish shartlari va chegirma qoidalari'
})
@IsOptional()
@IsString()
certificate_conditions?: string;
```

### UpdatePromotionDto
Automatically includes the `certificate_conditions` field through `PartialType(CreatePromotionDto)`.

## API Usage Examples

### Creating a Promotion with Certificate Conditions

#### Using JSON (POST /api/promotions):
```bash
curl -X POST "http://45.76.94.219:3132/api/promotions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sertifikat chegirmasi",
    "description": "Tibbiy xizmatlar uchun maxsus chegirma",
    "discount_percent": 20,
    "certificate_conditions": "Sertifikat olish shartlari:\n\n20% chegirma quyidagilarga taalluqli:\n- shifokor konsultatsiyasi;\n- diagnostika.\n\n10% chegirma quyidagilarga taalluqli:\n- operatsiyalar;\n- stomatologik xizmatlar.\n\nChegirma quyidagilarga tatbiq etilmaydi:\n- dori vositalari;\n- tibbiy sarf materiallari.\n\nChegirma boshqa amaldagi aksiyalar bilan qo'\''shilmaydi.",
    "clinicsId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C"
  }'
```

### Updating a Promotion's Certificate Conditions

```bash
curl -X PATCH "http://45.76.94.219:3132/api/promotions/01J9W5S1AJ8D9X1T9Y8QZV4K2C" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificate_conditions": "Yangilangan sertifikat shartlari:\n\n25% chegirma quyidagilarga taalluqli:\n- shifokor konsultatsiyasi;\n- diagnostika;\n- laboratoriya tekshiruvlari.\n\n15% chegirma quyidagilarga taalluqli:\n- operatsiyalar;\n- stomatologik xizmatlar;\n- fizioterapiya.\n\nChegirma quyidagilarga tatbiq etilmaydi:\n- dori vositalari;\n- tibbiy sarf materiallari;\n- kosmetik xizmatlar.\n\nChegirma boshqa amaldagi aksiyalar bilan qo'\''shilmaydi."
  }'
```

### JavaScript/Fetch Examples

```javascript
// Create promotion with certificate conditions
const createPromotionWithConditions = async (promotionData, token) => {
  const response = await fetch('http://45.76.94.219:3132/api/promotions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...promotionData,
      certificate_conditions: `Sertifikat olish shartlari:

20% chegirma quyidagilarga taalluqli:
- shifokor konsultatsiyasi;
- diagnostika.

10% chegirma quyidagilarga taalluqli:
- operatsiyalar;
- stomatologik xizmatlar.

Chegirma quyidagilarga tatbiq etilmaydi:
- dori vositalari;
- tibbiy sarf materiallari.

Chegirma boshqa amaldagi aksiyalar bilan qo'shilmaydi.`
    })
  });
  return await response.json();
};

// Update promotion's certificate conditions
const updatePromotionConditions = async (promotionId, conditions, token) => {
  const response = await fetch(`http://45.76.94.219:3132/api/promotions/${promotionId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ certificate_conditions: conditions })
  });
  return await response.json();
};
```

## Certificate Conditions Format

### Example Certificate Conditions:
```
Sertifikat olish shartlari:

20% chegirma quyidagilarga taalluqli:
- shifokor konsultatsiyasi;
- diagnostika.

10% chegirma quyidagilarga taalluqli:
- operatsiyalar;
- stomatologik xizmatlar.

Chegirma quyidagilarga tatbiq etilmaydi:
- dori vositalari;
- tibbiy sarf materiallari.

Chegirma boshqa amaldagi aksiyalar bilan qo'shilmaydi.
```

### Structure Guidelines:
1. **Title**: Clear heading for the conditions
2. **Discount Categories**: Organized by percentage with bullet points
3. **Exclusions**: Clear list of what's not covered
4. **Additional Rules**: Any special conditions or limitations
5. **Language**: Support for Uzbek, Russian, and English

## Frontend Integration

### Displaying Certificate Conditions
```javascript
// In your React component
const PromotionCard = ({ promotion }) => {
  return (
    <div className="promotion-card">
      <h3>{promotion.title}</h3>
      <p>{promotion.description}</p>
      <div className="discount-info">
        <span className="discount-percent">{promotion.discount_percent}% chegirma</span>
      </div>
      {promotion.certificate_conditions && (
        <div className="certificate-conditions">
          <h4>Sertifikat shartlari:</h4>
          <pre className="conditions-text">{promotion.certificate_conditions}</pre>
        </div>
      )}
    </div>
  );
};
```

### Styling Certificate Conditions
```css
.certificate-conditions {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.conditions-text {
  white-space: pre-line;
  font-family: inherit;
  line-height: 1.6;
  margin: 0;
  color: #495057;
}

.discount-percent {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
}
```

## Benefits

1. **Clear Terms**: Users understand exactly what services are covered
2. **Transparency**: No confusion about discount applicability
3. **Flexibility**: Can specify different discount rates for different services
4. **Compliance**: Helps with legal and regulatory requirements
5. **User Experience**: Better informed decision making

## Validation

- **Field Type**: String (optional)
- **Validation**: `@IsString()` decorator
- **Required**: No (optional field)
- **Length**: No specific limit (can store detailed conditions)
- **Format**: Plain text with support for line breaks and formatting

## Swagger Documentation

The new field is automatically documented in Swagger at `http://45.76.94.219:3132/docs` with:
- Complete API schema
- Example certificate conditions text
- Field description in Uzbek
- Validation requirements

## Testing

All existing promotion endpoints now support the `certificate_conditions` field:
- ✅ Create promotion
- ✅ Update promotion
- ✅ Get promotion details
- ✅ List promotions
- ✅ Delete promotion

The field is backward compatible and doesn't break existing functionality.

## Example Use Cases

### 1. Medical Consultation Discount
```json
{
  "title": "Shifokor konsultatsiyasi 20% chegirma",
  "description": "Barcha shifokor konsultatsiyalari uchun maxsus chegirma",
  "discount_percent": 20,
  "certificate_conditions": "20% chegirma faqat shifokor konsultatsiyalari uchun amal qiladi. Dori vositalari va diagnostika xizmatlari bundan mustasno."
}
```

### 2. Comprehensive Medical Services
```json
{
  "title": "To'liq tibbiy xizmatlar paketi",
  "description": "Keng qamrovli tibbiy xizmatlar uchun chegirma",
  "discount_percent": 15,
  "certificate_conditions": "15% chegirma quyidagi xizmatlar uchun:\n- Shifokor konsultatsiyasi\n- Laboratoriya tekshiruvlari\n- Rentgen va ultratovush\n- Fizioterapiya\n\nChegirma dori vositalari va operatsiyalar uchun amal qilmaydi."
}
```

### 3. Dental Services Special
```json
{
  "title": "Stomatologik xizmatlar aksiyasi",
  "description": "Barcha stomatologik xizmatlar uchun maxsus narxlar",
  "discount_percent": 25,
  "certificate_conditions": "25% chegirma barcha stomatologik xizmatlar uchun:\n- Tish tozalash\n- Karies davolash\n- Tish protezlari\n- Implantatsiya\n\nChegirma kosmetik stomatologik xizmatlar uchun amal qilmaydi."
}
```

## Error Handling

### Common Error Responses:
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have admin role
- **404 Not Found**: Promotion not found

### Example Error Response:
```json
{
  "message": "Promotion not found!",
  "error": "Not Found",
  "statusCode": 404
}
```

## Security

- **Read Operations**: Public access (no authentication required)
- **Write Operations**: Admin role required
- **Authentication**: JWT token required for admin operations
- **Authorization**: Role-based access control using `RoleGuard`

The certificate conditions field is now fully integrated into the promotions module and ready for use!
