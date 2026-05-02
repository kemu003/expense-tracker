# SpendWise Backend - Project Summary

## 🎯 Project Overview

Successfully built a **Django REST Framework backend** specifically designed for the SpendWise expense tracking React frontend. The backend handles user authentication, expense/income/budget management, and provides analytics endpoints.

---

## 📁 Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── spendwise/              # Django project
    │   ├── __init__.py
    │   ├── settings.py         # Configuration (CORS, JWT, apps)
    │   ├── urls.py             # Main URL router
    │   ├── asgi.py
    │   └── wsgi.py
    │
    ├── api/                    # Main app
    │   ├── models.py           # Expense, Income, Budget
    │   ├── serializers.py      # DRF serializers
    │   ├── views.py            # ViewSets & API views
    │   ├── urls.py             # API routing
    │   ├── permissions.py      # IsOwner permission
    │   ├── admin.py            # Django admin config
    │   ├── apps.py
    │   └── __init__.py
    │
    ├── manage.py               # Django management
    ├── requirements.txt        # Python dependencies
    ├── db.sqlite3              # SQLite database
    ├── README.md               # Setup instructions
    ├── INTEGRATION.md          # Frontend integration guide
    └── .gitignore
```

---

## 🔐 Authentication

**JWT (JSON Web Tokens)** using `djangorestframework-simplejwt`

- **Register:** `POST /api/auth/register/`
- **Login:** `POST /api/auth/login/` → returns `access` + `refresh` tokens
- **Refresh:** `POST /api/auth/refresh/`

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

## 📊 Core Models

### Expense
- `user` (FK to User)
- `title` (CharField)
- `amount` (DecimalField)
- `category` (Food, Transport, Bills, Shopping, Entertainment, Health, Other)
- `date` (DateField)
- `notes` (TextField)
- `created_at` (auto_now_add)

### Income
- `user` (FK to User)
- `amount` (DecimalField)
- `source` (CharField)
- `date` (DateField)
- `notes` (TextField)
- `created_at` (auto_now_add)

### Budget
- `user` (FK to User)
- `category` (CharField)
- `month` (CharField: YYYY-MM)
- `amount` (DecimalField)
- `created_at` (auto_now_add)
- Unique constraint: `user + category + month`

---

## 🔌 API Endpoints

### Data CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/` | List user's expenses (with filters) |
| POST | `/api/expenses/` | Create expense |
| PUT | `/api/expenses/{id}/` | Update expense |
| DELETE | `/api/expenses/{id}/` | Delete expense |
| GET | `/api/income/` | List user's income |
| POST | `/api/income/` | Create income |
| PUT | `/api/income/{id}/` | Update income |
| DELETE | `/api/income/{id}/` | Delete income |
| GET | `/api/budgets/` | List user's budgets |
| POST | `/api/budgets/` | Create budget |
| PUT | `/api/budgets/{id}/` | Update budget |
| DELETE | `/api/budgets/{id}/` | Delete budget |

### Filtering & Search
**Expenses:**
- `?category=Food` - Filter by category
- `?date_from=2026-01-01&date_to=2026-12-31` - Date range
- `?search=lunch` - Search in title/notes/category

**Income:**
- `?date_from=2026-01-01&date_to=2026-12-31` - Date range
- `?search=salary` - Search in source/notes

**Budgets:**
- `?month=2026-05` - Filter by month

### Analytics
| Endpoint | Response |
|----------|----------|
| `GET /api/dashboard/stats/` | `{ today_expenses, week_expenses, month_expenses, month_income, balance }` |
| `GET /api/analytics/category_breakdown/` | Array of `{ label, value, percentage }` for current month |
| `GET /api/analytics/monthly_trends/` | `{ months, expenses, income }` for last 6 months |

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register/` | POST | Create new user |
| `/api/auth/login/` | POST | Get JWT tokens |
| `/api/auth/refresh/` | POST | Refresh access token |

---

## 🛡️ Security Features

✅ **User Isolation:** Each user only sees their own data via JWT-based authentication  
✅ **Permission Classes:** `IsAuthenticated` + custom `IsOwner` permission  
✅ **Password Hashing:** Django's default PBKDF2 password hasher  
✅ **CORS Protected:** Whitelist only trusted origins  
✅ **Token Expiration:** Access token (60 min), Refresh token (1 day)  

---

## 🌍 CORS Configuration

Currently allowed:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",    # Vite dev server
    "http://127.0.0.1:5173",
]
```

Update in `backend/spendwise/settings.py` for production URLs.

---

## 💱 Currency Update

Frontend updated from USD ($) to **Kenyan Shillings (KSh)**:
- `Dashboard.tsx` ✅
- `AnalyticsPage.tsx` ✅
- `ExpensesPage.tsx` ✅
- `IncomePage.tsx` ✅
- `BudgetsPage.tsx` ✅
- `ExpenseModal.tsx` ✅

---

## 🚀 Running the Backend

### Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser
```

### Run Server
```bash
python manage.py runserver
# Server available at http://127.0.0.1:8000/
# API at http://127.0.0.1:8000/api/
# Admin panel at http://127.0.0.1:8000/admin/
```

---

## 🔄 Database

**SQLite** (development) at `backend/db.sqlite3`

For production, update `DATABASES` in `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'spendwise',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 📝 Next Steps

1. **Connect Frontend**
   - Create `src/lib/api.ts` with API client
   - Update `AuthContext.tsx` to use API
   - Update hooks to fetch from backend
   - See `backend/INTEGRATION.md` for details

2. **Test API**
   - Use Postman, Insomnia, or curl to test endpoints
   - Create test user account

3. **Production Deployment**
   - Use environment variables (`.env`)
   - Set `DEBUG = False`
   - Use production database (PostgreSQL)
   - Use WSGI server (Gunicorn)
   - Set up proper CORS for frontend domain

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `backend/README.md` | Backend setup & endpoint documentation |
| `backend/INTEGRATION.md` | Frontend integration guide & code examples |
| `backend/requirements.txt` | Python package dependencies |
| `backend/spendwise/settings.py` | Django configuration (installed apps, JWT, CORS) |
| `backend/api/models.py` | Database models (Expense, Income, Budget) |
| `backend/api/serializers.py` | DRF serializers for API responses |
| `backend/api/views.py` | ViewSets, API logic, analytics queries |
| `backend/api/permissions.py` | Custom permission classes |
| `backend/api/urls.py` | API routing configuration |

---

## ✨ Features Implemented

- ✅ User registration & JWT authentication
- ✅ Expense tracking (CRUD + filtering + search)
- ✅ Income tracking (CRUD + filtering + search)
- ✅ Budget management (CRUD + monthly organization)
- ✅ Dashboard statistics (today, week, month totals, balance)
- ✅ Category breakdown analytics
- ✅ Monthly trends for 6 months
- ✅ User-specific data isolation
- ✅ CORS enabled for frontend development
- ✅ Currency updated to KSh in frontend
- ✅ Comprehensive error handling

---

## 🐛 Troubleshooting

**Import Error when running server?**
- Run `python manage.py makemigrations` first

**CORS errors on frontend?**
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`
- Ensure frontend URL matches exactly

**401 Unauthorized on API calls?**
- Token might be expired, use refresh endpoint
- Check token is included in Authorization header

**Database locked?**
- Delete `db.sqlite3` and run migrations again

---

Last updated: May 2, 2026