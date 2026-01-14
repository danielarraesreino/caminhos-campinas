# Caminhos Campinas - API Reference

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://caminhos-campinas.vercel.app`

## Authentication

Currently, most endpoints are public. Authentication is planned for admin features.

---

## Partners API

### Create Partner

Register a new partner organization (NGO, government agency, or company).

**Endpoint:** `POST /api/partners`

**Request Body:**

```json
{
  "name": "string (required, 2-200 chars)",
  "category": "NGO | GOV | COMPANY (required)",
  "whatsapp": "string (optional, E.164 format)",
  "description": "string (optional, max 1000 chars)",
  "address": "string (optional, max 500 chars)",
  "latitude": "number (optional, -90 to 90)",
  "longitude": "number (optional, -180 to 180)"
}
```

**Example Request:**

```json
{
  "name": "Centro Pop São Vicente",
  "category": "GOV",
  "whatsapp": "+5519987654321",
  "description": "Espaço de referência para atendimento especializado",
  "address": "Rua José Paulino, 123 - Campinas/SP",
  "latitude": -22.915,
  "longitude": -47.052
}
```

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Centro Pop São Vicente",
  "category": "GOV",
  "whatsapp": "+5519987654321",
  "description": "Espaço de referência para atendimento especializado",
  "address": "Rua José Paulino, 123 - Campinas/SP",
  "status": "PENDING",
  "latitude": -22.915,
  "longitude": -47.052,
  "createdAt": "2026-01-14T07:00:00.000Z",
  "requestId": "req_1705215600_abc123"
}
```

**Validation Error (400):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "whatsapp",
      "message": "Número de WhatsApp inválido"
    }
  ],
  "requestId": "req_1705215600_abc123"
}
```

**Service Error (503):**

```json
{
  "error": "Service temporarily unavailable",
  "requestId": "req_1705215600_abc123"
}
```

### List Partners

Retrieve all partners, optionally filtered by status.

**Endpoint:** `GET /api/partners`

**Query Parameters:**

- `status` (optional): Filter by status (`PENDING`, `APPROVED`, `REJECTED`)

**Example Request:**

```
GET /api/partners?status=APPROVED
```

**Success Response (200):**

```json
{
  "partners": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Centro Pop São Vicente",
      "category": "GOV",
      "status": "APPROVED",
      "createdAt": "2026-01-14T07:00:00.000Z"
    }
  ],
  "requestId": "req_1705215600_def456"
}
```

---

## Feedback API

### Submit Dilemma Feedback

*(Implementation pending)*

**Endpoint:** `POST /api/feedback/dilemma`

**Request Body:**

```json
{
  "dilemmaId": "string (required)",
  "userId": "string (required, anonymous hash)",
  "isRealistic": "boolean (required)",
  "comment": "string (optional, max 500 chars)"
}
```

---

## Posts API (Jornal da Rua)

### Create Post

*(Implementation pending)*

**Endpoint:** `POST /api/posts`

**Request Body:**

```json
{
  "title": "string (optional)",
  "content": "string (required)",
  "author": "string (optional, anonymous allowed)",
  "contact": "string (optional)",
  "category": "DENUNCIA | RELATO | POESIA (required)"
}
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input (validation error) |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error (check logs) |
| 503 | Service Unavailable | Database or service unavailable |

---

## Request Tracing

All API responses include a `requestId` field for tracing:

```json
{
  "requestId": "req_1705215600_abc123"
}
```

Use this ID when reporting issues or searching logs.

---

## Rate Limiting

*(Not yet implemented)*

Planned limits:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Health Check

**Endpoint:** `GET /api/health`

*(Not yet implemented)*

Planned response:

```json
{
  "status": "healthy",
  "database": "connected",
  "indexedDB": "available",
  "uptime": 12345
}
```

---

## Development Notes

### Testing API Endpoints

```bash
# Create partner
curl -X POST http://localhost:3000/api/partners \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test NGO",
    "category": "NGO",
    "description": "Test organization"
  }'

# List partners
curl http://localhost:3000/api/partners?status=PENDING
```

### Request ID Format

`req_{timestamp}_{random_string}`

Example: `req_1705215600_abc123`

---

## Future Endpoints

1. `GET /api/stats` - Game statistics and census data
2. `POST /api/auth/register` - User registration
3. `GET /api/map/partners` - Geospatial partner data
4. `POST /api/telemetry` - Game analytics events
