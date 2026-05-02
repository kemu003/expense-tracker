# API Quick Reference

## Base URL
```
https://expense-trackerbackend-im6h.onrender.com/api/
```

## Headers
```
Content-Type: application/json
Authorization: Bearer <access_token>  (required for all endpoints except /auth/register/ and /auth/login/)
```

---

## Authentication Endpoints

### Register
```
POST /auth/register/

Request:
{
  "email": "user@example.com",
  "password": "pass123",
  "name": "John Doe"
}

Response (201):
{
  "message": "User created successfully"
}
```

### Login
```
POST /auth/login/

Request:
{
  "username": "user@example.com",
  "password": "pass123"
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Refresh Token
```
POST /auth/refresh/

Request:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## Expenses

### List
```
GET /expenses/
GET /expenses/?category=Food
GET /expenses/?date_from=2026-01-01&date_to=2026-12-31
GET /expenses/?search=lunch

Response (200):
[
  {
    "id": 1,
    "user_id": 5,
    "title": "Lunch",
    "amount": "500.00",
    "category": "Food",
    "date": "2026-05-02",
    "notes": "At restaurant",
    "created_at": "2026-05-02T10:30:00Z"
  },
  ...
]
```

### Create
```
POST /expenses/

Request:
{
  "title": "Lunch",
  "amount": "500.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "At restaurant"
}

Response (201):
{
  "id": 1,
  "user_id": 5,
  "title": "Lunch",
  "amount": "500.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "At restaurant",
  "created_at": "2026-05-02T10:30:00Z"
}
```

### Retrieve
```
GET /expenses/1/

Response (200):
{
  "id": 1,
  "user_id": 5,
  "title": "Lunch",
  "amount": "500.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "At restaurant",
  "created_at": "2026-05-02T10:30:00Z"
}
```

### Update
```
PUT /expenses/1/

Request:
{
  "title": "Lunch",
  "amount": "600.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "Updated"
}

Response (200):
{
  "id": 1,
  "user_id": 5,
  "title": "Lunch",
  "amount": "600.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "Updated",
  "created_at": "2026-05-02T10:30:00Z"
}
```

### Partial Update
```
PATCH /expenses/1/

Request:
{
  "amount": "700.00"
}

Response (200):
{
  "id": 1,
  "user_id": 5,
  "title": "Lunch",
  "amount": "700.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "Updated",
  "created_at": "2026-05-02T10:30:00Z"
}
```

### Delete
```
DELETE /expenses/1/

Response (204): No content
```

---

## Income

### List
```
GET /income/
GET /income/?date_from=2026-01-01&date_to=2026-12-31
GET /income/?search=salary

Response (200):
[
  {
    "id": 1,
    "user_id": 5,
    "amount": "50000.00",
    "source": "Salary",
    "date": "2026-05-01",
    "notes": "Monthly salary",
    "created_at": "2026-05-01T00:00:00Z"
  },
  ...
]
```

### Create
```
POST /income/

Request:
{
  "amount": "50000.00",
  "source": "Salary",
  "date": "2026-05-01",
  "notes": "Monthly salary"
}

Response (201):
{
  "id": 1,
  "user_id": 5,
  "amount": "50000.00",
  "source": "Salary",
  "date": "2026-05-01",
  "notes": "Monthly salary",
  "created_at": "2026-05-01T00:00:00Z"
}
```

(Update/Delete same pattern as Expenses)

---

## Budgets

### List
```
GET /budgets/
GET /budgets/?month=2026-05

Response (200):
[
  {
    "id": 1,
    "user_id": 5,
    "category": "Food",
    "month": "2026-05",
    "amount": "5000.00",
    "created_at": "2026-05-01T10:00:00Z"
  },
  ...
]
```

### Create
```
POST /budgets/

Request:
{
  "category": "Food",
  "month": "2026-05",
  "amount": "5000.00"
}

Response (201):
{
  "id": 1,
  "user_id": 5,
  "category": "Food",
  "month": "2026-05",
  "amount": "5000.00",
  "created_at": "2026-05-01T10:00:00Z"
}
```

(Update/Delete same pattern as Expenses)

---

## Dashboard

### Stats
```
GET /dashboard/stats/

Response (200):
{
  "today_expenses": 1500.00,
  "week_expenses": 8500.00,
  "month_expenses": 35000.00,
  "month_income": 50000.00,
  "balance": 15000.00
}
```

---

## Analytics

### Category Breakdown
```
GET /analytics/category_breakdown/

Response (200):
[
  {
    "label": "Food",
    "value": 15000.00,
    "percentage": 42.857142857142854
  },
  {
    "label": "Transport",
    "value": 8000.00,
    "percentage": 22.857142857142858
  },
  {
    "label": "Bills",
    "value": 7000.00,
    "percentage": 20.0
  },
  {
    "label": "Entertainment",
    "value": 5000.00,
    "percentage": 14.285714285714286
  }
]
```

### Monthly Trends
```
GET /analytics/monthly_trends/

Response (200):
{
  "months": ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  "expenses": [25000.0, 30000.0, 28000.0, 32000.0, 35000.0, 28000.0],
  "income": [50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"],
  "another_field": ["Another error"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Category Options
```
Food
Transport
Bills
Shopping
Entertainment
Health
Other
```

---

## Notes
- All dates are in `YYYY-MM-DD` format
- All amounts are strings with decimal precision (2 places)
- Timestamps are in ISO 8601 format
- User ID is automatically set from the authenticated user
- All list endpoints return empty arrays if no results