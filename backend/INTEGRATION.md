# Frontend-Backend Integration Guide

## Overview
The frontend is currently configured to use Supabase. This guide explains how to switch to the Django REST Framework backend.

## Backend API Base URL
```
http://127.0.0.1:8000/api/
```

## Authentication Flow

### 1. Register (Create Account)
**Endpoint:** `POST /api/auth/register/`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

### 2. Login
**Endpoint:** `POST /api/auth/login/`

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

Store the `access` token and use it in all future requests:
```
Authorization: Bearer <access_token>
```

### 3. Refresh Token
**Endpoint:** `POST /api/auth/refresh/`

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## Data Endpoints

### Expenses

**List Expenses (with filters)**
```
GET /api/expenses/?category=Food&date_from=2026-01-01&date_to=2026-12-31&search=lunch
```

**Create Expense**
```
POST /api/expenses/

{
  "title": "Lunch",
  "amount": "500.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "Lunch at restaurant"
}
```

**Update Expense**
```
PUT /api/expenses/{id}/

{
  "title": "Lunch",
  "amount": "600.00",
  "category": "Food",
  "date": "2026-05-02",
  "notes": "Updated note"
}
```

**Delete Expense**
```
DELETE /api/expenses/{id}/
```

### Income

Similar structure to Expenses:
```
GET /api/income/?date_from=2026-01-01&date_to=2026-12-31&search=salary
POST /api/income/
PUT /api/income/{id}/
DELETE /api/income/{id}/
```

**Create Income**
```json
{
  "amount": "50000.00",
  "source": "Salary",
  "date": "2026-05-01",
  "notes": "Monthly salary"
}
```

### Budgets

```
GET /api/budgets/?month=2026-05
POST /api/budgets/
PUT /api/budgets/{id}/
DELETE /api/budgets/{id}/
```

**Create Budget**
```json
{
  "category": "Food",
  "month": "2026-05",
  "amount": "5000.00"
}
```

---

## Analytics & Dashboard

### Dashboard Stats
```
GET /api/dashboard/stats/
```

**Response:**
```json
{
  "today_expenses": 1500.00,
  "week_expenses": 8500.00,
  "month_expenses": 35000.00,
  "month_income": 50000.00,
  "balance": 15000.00
}
```

### Category Breakdown
```
GET /api/analytics/category_breakdown/
```

**Response:**
```json
[
  {
    "label": "Food",
    "value": 15000.00,
    "percentage": 42.86
  },
  {
    "label": "Transport",
    "value": 8000.00,
    "percentage": 22.86
  }
]
```

### Monthly Trends
```
GET /api/analytics/monthly_trends/
```

**Response:**
```json
{
  "months": ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  "expenses": [25000, 30000, 28000, 32000, 35000, 28000],
  "income": [50000, 50000, 50000, 50000, 50000, 50000]
}
```

---

## Frontend Implementation Changes

### 1. Create a new API service (`src/lib/api.ts`)

```typescript
const API_BASE = 'http://127.0.0.1:8000/api';

class ApiClient {
  private token: string | null = localStorage.getItem('access_token');

  private headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }

  async register(email: string, password: string, name: string) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ email, password, name }),
    });
    return res.json();
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ username: email, password }),
    });
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      this.token = data.access;
    }
    return data;
  }

  async getExpenses(params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/expenses/?${query}`, { headers: this.headers() }).then(r => r.json());
  }

  async createExpense(data: any) {
    return fetch(`${API_BASE}/expenses/`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data),
    }).then(r => r.json());
  }

  // Add similar methods for income, budgets, dashboard, analytics...
}

export const api = new ApiClient();
```

### 2. Update `AuthContext.tsx`

Replace Supabase calls with API client:

```typescript
const signUp = async (email: string, password: string, name: string) => {
  const result = await api.register(email, password, name);
  if (result.error) {
    return { error: result.error };
  }
  // Auto-login after registration
  return api.login(email, password);
};

const signIn = async (email: string, password: string) => {
  const result = await api.login(email, password);
  if (result.error || !result.access) {
    return { error: 'Invalid credentials' };
  }
  // Set user from token (you may want to decode JWT)
  return { error: null };
};
```

### 3. Update hooks (`useExpenses.ts`, `useIncome.ts`)

Replace Supabase queries with API calls:

```typescript
const fetchExpenses = useCallback(async () => {
  if (!user) return;
  setLoading(true);
  const data = await api.getExpenses();
  setExpenses(data);
  setLoading(false);
}, [user]);
```

---

## Database Admin

Create a superuser for Django admin:
```bash
py manage.py createsuperuser
```

Then visit: `http://127.0.0.1:8000/admin/`

---

## Troubleshooting

### CORS Issues
If you get CORS errors, the frontend origin might not be allowed. Update `backend/spendwise/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Add your frontend URL here
]
```

### Token Expiration
Access tokens expire after 60 minutes. Implement token refresh:

```typescript
if (error.status === 401) {
  const refreshed = await api.refreshToken();
  if (refreshed.access) {
    // Retry the request
  } else {
    // Redirect to login
  }
}
```

### User Data Association
All expenses, income, and budgets are automatically associated with the logged-in user via the JWT token. No need to send `user_id` in requests.
