# SpendWise Backend

Django REST Framework backend for SpendWise expense tracking app.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

5. Run the server:
   ```bash
   python manage.py runserver
   ```

The API will be available at http://127.0.0.1:8000/api/

## API Endpoints

### Authentication
- POST /api/auth/register/ - Register new user
- POST /api/auth/login/ - Login (get JWT tokens)
- POST /api/auth/refresh/ - Refresh access token

### Expenses
- GET /api/expenses/ - List expenses (with filtering)
- POST /api/expenses/ - Create expense
- GET /api/expenses/{id}/ - Get expense
- PUT /api/expenses/{id}/ - Update expense
- DELETE /api/expenses/{id}/ - Delete expense

Query parameters for filtering:
- category: Filter by category
- date_from: Filter from date (YYYY-MM-DD)
- date_to: Filter to date (YYYY-MM-DD)
- search: Search in title, notes, category

### Income
- Similar to expenses, with date_from, date_to, search

### Budgets
- GET /api/budgets/ - List budgets
- POST /api/budgets/ - Create budget
- GET /api/budgets/{id}/ - Get budget
- PUT /api/budgets/{id}/ - Update budget
- DELETE /api/budgets/{id}/ - Delete budget

Query parameters:
- month: Filter by month (YYYY-MM)

### Dashboard
- GET /api/dashboard/stats/ - Get dashboard statistics

### Analytics
- GET /api/analytics/category_breakdown/ - Category breakdown for current month
- GET /api/analytics/monthly_trends/ - Monthly trends for last 6 months

All endpoints except auth require JWT authentication in Authorization header: Bearer {token}