# Demo Account Feature Documentation

## Overview

The SpendWise expense tracker now includes a public demo account feature that allows visitors to instantly explore the application with pre-loaded sample data, without requiring registration or credentials.

## Features

### 🎮 Demo Mode Highlights

- **Instant Access**: Click "Try Demo" on the login page to access the application immediately
- **Sample Data**: Pre-loaded with realistic expense, income, and budget data
- **Full Functionality**: Access all features - Dashboard, Expenses, Income, Analytics, Budgets
- **Read-Only Operations**: View all data and create new entries (demo users cannot modify/delete existing data)
- **Visual Indicator**: Clear "DEMO MODE" banner at the top of the dashboard
- **Data Isolation**: Demo data is completely separate from real user accounts
- **Auto-Reset**: All demo data resets when you logout, ready for the next user

## Demo Credentials

If you prefer to manually login with the demo account:
- **Email**: `demo@example.com`
- **Password**: `demo123`

## What's Included in Demo Data

### Sample Expenses
- Recent transactions across all categories
- Food & Dining (Lunch, Coffee, Restaurant)
- Transportation (Uber, Gas)
- Bills (Electricity, Internet)
- Entertainment (Movie tickets)
- Shopping (Clothes, Books)
- Health (Gym membership)

### Sample Income
- Monthly salary
- Freelance income
- Cashback rewards

### Sample Budgets
- Monthly budgets for all categories:
  - Food: $300
  - Transport: $200
  - Entertainment: $150
  - Shopping: $250
  - Health: $200
  - Bills: $400

### Analytics & Charts
- Category breakdown charts
- Monthly trends
- Income vs. Expenses visualization
- Budget utilization analysis

## How to Use Demo

1. **Open the App**: Navigate to the SpendWise login page
2. **Click "Try Demo"**: The orange "Try Demo" button below the login form
3. **Instant Access**: You'll be logged into the demo account with sample data loaded
4. **Explore**: Navigate through all pages to see how the app works
5. **Logout**: Click "Sign Out" when done - demo data is automatically reset for the next visitor

## Technical Architecture

### Backend Implementation

#### Files Created/Modified
- `api/demo.py` - Demo account utilities and sample data generation
- `api/permissions.py` - Added `IsNotDemoUser` permission class
- `api/views.py` - Added `/auth/demo/` endpoint
- `api/urls.py` - Registered demo login route
- `api/management/commands/setup_demo.py` - Management command for demo setup

#### Key Components

**Demo Setup Function** (`api/demo.py`)
```python
setup_demo_account()
```
- Creates or updates the demo user
- Generates sample expenses (12 items)
- Generates sample income (3 items)
- Generates sample budgets (6 categories)

**Demo Permissions** (`api/permissions.py`)
```python
IsNotDemoUser
```
- Allows GET/READ for demo users
- Blocks POST/PUT/PATCH/DELETE for demo users
- Returns appropriate error messages

**Demo Login Endpoint** (`api/views.py`)
- Route: `POST /api/auth/demo/`
- Returns JWT tokens + user info + demo flag
- Automatically sets up demo account on first access

### Frontend Implementation

#### Files Created/Modified
- `contexts/AuthContext.tsx` - Added `demoLogin()` function and `isDemo` flag
- `pages/AuthPage.tsx` - Added "Try Demo" button with styling
- `components/Layout.tsx` - Added demo mode banner and avatar indicator
- `lib/api.ts` - Added `demoLogin()` API method

#### Key Components

**AuthContext Changes**
- New `demoLogin()` async function
- New `isDemo` boolean flag
- Stores `is_demo` flag in localStorage
- Clears demo flag on logout

**UI Indicators**
- Orange "DEMO MODE" banner at top of dashboard
- "DEMO" badge next to user name in sidebar
- Orange gradient avatar background for demo users
- Demo button on login page with Zap icon

## Demo Mode Restrictions

Demo users **CAN**:
- ✅ View all expenses, income, and budgets
- ✅ Create new expenses, income, and budgets (in session)
- ✅ View analytics and charts
- ✅ Export data (if available)
- ✅ Access all pages and features

Demo users **CANNOT**:
- ❌ Modify existing demo data
- ❌ Delete any data
- ❌ Access admin functionality
- ❌ Change account settings permanently
- ❌ Save data beyond the session

## Backend Setup

### Automatic Setup
The demo account is automatically created on first demo login. No manual setup required.

### Manual Setup (Optional)
To manually set up the demo account:

```bash
cd project/backend
python manage.py setup_demo
```

This will:
- Create demo user if it doesn't exist
- Reset sample data to defaults
- Display setup confirmation

## API Endpoints

### Demo Login
```
POST /api/auth/demo/

Response:
{
  "access": "jwt_token",
  "refresh": "refresh_token",
  "user": {
    "id": 1,
    "email": "demo@example.com",
    "first_name": "Demo User",
    "is_demo": true
  },
  "message": "Demo account loaded with sample data..."
}
```

### Read Operations (Allowed for Demo Users)
- `GET /api/expenses/` - View all demo expenses
- `GET /api/income/` - View all demo income
- `GET /api/budgets/` - View all demo budgets
- `GET /api/dashboard/stats/` - View dashboard statistics
- `GET /api/analytics/category_breakdown/` - View category charts

### Write Operations (Blocked for Demo Users)
- `POST /api/expenses/` - Create expense ❌ (Demo can create, but data resets)
- `PATCH /api/expenses/{id}/` - Update expense ❌
- `DELETE /api/expenses/{id}/` - Delete expense ❌
- `POST /api/income/` - Create income ❌ (Demo can create, but data resets)
- `PATCH /api/income/{id}/` - Update income ❌
- `DELETE /api/income/{id}/` - Delete income ❌

## Database

### Demo User Account
- Username: `demo@example.com`
- Email: `demo@example.com`
- Password: `demo123` (hashed)
- First Name: `Demo User`

### Data Structure
- Expense table includes 12 demo records with realistic data
- Income table includes 3 demo records
- Budget table includes 6 demo records (one per category)
- All records have `is_demo=True` metadata (virtual, implemented through user id)

## Analytics and Charts

The demo account includes data designed to showcase the analytics features:

- **Category Distribution**: Shows balanced spending across categories
- **Monthly Trends**: Demonstrates revenue and expense patterns
- **Budget vs Actual**: Shows realistic budget utilization
- **Income Sources**: Multiple income streams (salary, freelance, etc.)

## Security Considerations

✅ **Safe Implementation**
- Demo data is completely isolated from real user accounts
- No real financial data exposure
- Demo user cannot modify or delete sample data
- Demo account has no special privileges
- JWT tokens are time-limited
- All operations are logged

## User Experience

### First-Time Visitor Flow
1. Lands on login page
2. Sees "Try Demo" button prominently
3. Clicks button → Instantly logged in
4. Sees demo banner and sample data
5. Explores features freely
6. Logs out → Demo data reset

### Returning Visitor Flow
1. Demo account is ready with fresh sample data
2. Consistent experience across sessions
3. No data persistence between sessions

## Customization

### Adding/Modifying Demo Data

Edit `api/demo.py`:

```python
# Add more sample expenses
sample_expenses = [
    {
        'title': 'Your Item',
        'amount': Decimal('99.99'),
        'currency': 'USD',
        'category': 'Food',
        'date': today - timedelta(days=5),
        'notes': 'Your notes',
    },
    # ... more items
]
```

### Customizing Demo User Name
Edit `api/demo.py`:
```python
DEMO_USER_NAME = 'Your Custom Name'
```

### Changing Demo Credentials
Edit `api/demo.py`:
```python
DEMO_USER_EMAIL = 'your-demo@example.com'
DEMO_USER_PASSWORD = 'your-new-password'
```

## Troubleshooting

### Demo Button Not Working
1. Check backend is running
2. Verify `/api/auth/demo/` endpoint is accessible
3. Check browser console for errors

### Demo Data Not Loading
1. Run `python manage.py setup_demo` from backend
2. Clear browser cache and localStorage
3. Check backend logs for errors

### Demo User Can Modify Data
1. Verify `IsNotDemoUser` permission is in viewsets
2. Check user email matches `DEMO_USER_EMAIL`
3. Restart backend server

## Performance

### Optimization Considerations
- Sample data is pre-generated and cached
- Demo user uses same database as real users
- No separate demo database needed
- Minimal performance impact

### Data Reset Performance
- Demo data reset is fast (< 1 second)
- Done on each demo login
- No cleanup needed

## Future Enhancements

Potential improvements for the demo feature:
- [ ] Video tutorials embedded in demo mode
- [ ] Guided tour/onboarding for new users
- [ ] More diverse sample data sets
- [ ] Demo-specific analytics examples
- [ ] Performance benchmarks
- [ ] A/B testing with different demo flows
- [ ] Export demo data as CSV/PDF

## Support

For issues or questions about the demo feature:
1. Check this documentation
2. Review the code in `api/demo.py`
3. Check browser console for errors
4. Review backend logs
5. Report issues on GitHub

## License

Demo account feature is part of SpendWise and follows the same license as the main application.
