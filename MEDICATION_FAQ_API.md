# Medication FAQ API Documentation

## Overview
The Medication FAQ system allows you to add, manage, and retrieve frequently asked questions (FAQs) for specific medications. This feature enables users to get quick answers to common questions about medications like "MAGNE V6".

## Database Schema
The FAQ system uses the existing `FAQ` table with an optional relationship to medications:

```prisma
model FAQ {
  id       String @id @default(ulid())
  question String
  answer   String

  // Optional medication relationship
  medicationId String?
  medication   Medications? @relation(fields: [medicationId], references: [id])

  createdAt DateTime @default(now())
}
```

## API Endpoints

### 1. Get FAQs for a Medication
**GET** `/api/medications/:id/faqs`

Retrieves all FAQs for a specific medication.

**Parameters:**
- `id` (string): Medication ID

**Response:**
```json
[
  {
    "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "question": "Зарегистрирован ли препарат MAGNE V6 tabletkalar крем в реестре препаратов Узбекистана?",
    "answer": "Да, препарат зарегистирован в реестре препаратов Узбекистана.",
    "medicationId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Add FAQ to a Medication
**POST** `/api/medications/:id/faqs`

Adds a new FAQ to a specific medication. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "question": "Кто производитель препарата MAGNE V6 tabletkalar крем и какая страна происхождения?",
  "answer": "Производитель: Sanofi, страна происхождения: Франция."
}
```

**Response:**
```json
{
  "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "question": "Кто производитель препарата MAGNE V6 tabletkalar крем и какая страна происхождения?",
  "answer": "Производитель: Sanofi, страна происхождения: Франция.",
  "medicationId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. Update a Medication FAQ
**PATCH** `/api/medications/:medicationId/faqs/:faqId`

Updates an existing FAQ for a specific medication. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "question": "Updated question text",
  "answer": "Updated answer text"
}
```

**Response:**
```json
{
  "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "question": "Updated question text",
  "answer": "Updated answer text",
  "medicationId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Delete a Medication FAQ
**DELETE** `/api/medications/:medicationId/faqs/:faqId`

Deletes an FAQ from a specific medication. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:**
```json
{
  "id": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "question": "Deleted question",
  "answer": "Deleted answer",
  "medicationId": "01J9W5S1AJ8D9X1T9Y8QZV4K2C",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## Example Usage

### Using curl:

#### Get FAQs for a medication:
```bash
curl -X GET "http://45.76.94.219:3132/api/medications/01J9W5S1AJ8D9X1T9Y8QZV4K2C/faqs"
```

#### Add a new FAQ:
```bash
curl -X POST "http://45.76.94.219:3132/api/medications/01J9W5S1AJ8D9X1T9Y8QZV4K2C/faqs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Сколько стоит препарат MAGNE V6 tabletkalar крем в аптеках Узбекистана?",
    "answer": "Цена препарата MAGNE V6 варьируется от 15,000 до 25,000 сум в зависимости от аптеки и региона."
  }'
```

#### Update an FAQ:
```bash
curl -X PATCH "http://45.76.94.219:3132/api/medications/01J9W5S1AJ8D9X1T9Y8QZV4K2C/faqs/01J9W5S1AJ8D9X1T9Y8QZV4K2D" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Updated answer with more detailed information."
  }'
```

#### Delete an FAQ:
```bash
curl -X DELETE "http://45.76.94.219:3132/api/medications/01J9W5S1AJ8D9X1T9Y8QZV4K2C/faqs/01J9W5S1AJ8D9X1T9Y8QZV4K2D" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch:

```javascript
// Get FAQs for a medication
const getMedicationFaqs = async (medicationId) => {
  const response = await fetch(`http://45.76.94.219:3132/api/medications/${medicationId}/faqs`);
  return await response.json();
};

// Add a new FAQ
const addMedicationFaq = async (medicationId, question, answer, token) => {
  const response = await fetch(`http://45.76.94.219:3132/api/medications/${medicationId}/faqs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question, answer })
  });
  return await response.json();
};

// Update an FAQ
const updateMedicationFaq = async (medicationId, faqId, updateData, token) => {
  const response = await fetch(`http://45.76.94.219:3132/api/medications/${medicationId}/faqs/${faqId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  return await response.json();
};

// Delete an FAQ
const deleteMedicationFaq = async (medicationId, faqId, token) => {
  const response = await fetch(`http://45.76.94.219:3132/api/medications/${medicationId}/faqs/${faqId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

## Error Handling

### Common Error Responses:

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have admin role (for write operations)
- **404 Not Found**: Medication or FAQ not found

### Example Error Response:
```json
{
  "message": "Medication not found!",
  "error": "Not Found",
  "statusCode": 404
}
```

## Security

- **Read Operations**: Public access (no authentication required)
- **Write Operations**: Admin role required
- **Authentication**: JWT token required for admin operations
- **Authorization**: Role-based access control using `RoleGuard`

## Integration with Frontend

The FAQ system is designed to work seamlessly with frontend applications:

1. **Display FAQs**: Use the GET endpoint to fetch and display FAQs for a medication
2. **Admin Management**: Use POST/PATCH/DELETE endpoints for FAQ management
3. **Real-time Updates**: FAQs are immediately available after creation/update
4. **Search Integration**: FAQs can be included in medication search results

## Best Practices

1. **Question Format**: Use clear, specific questions that users commonly ask
2. **Answer Quality**: Provide comprehensive, accurate answers
3. **Language Support**: Support multiple languages (Uzbek, Russian, English)
4. **Regular Updates**: Keep FAQs updated with current information
5. **Categorization**: Consider organizing FAQs by topic or medication type

## Swagger Documentation

All endpoints are documented in Swagger and can be accessed at:
`http://45.76.94.219:3132/docs`

The Swagger documentation includes:
- Complete API schema
- Request/response examples
- Authentication requirements
- Error response codes
- Interactive testing interface
