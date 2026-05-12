# Demo Account - Quick Start Guide

## For Users

### Try the Demo
1. Open the login page
2. Click the orange **"Try Demo"** button
3. Instantly see the dashboard with sample data
4. Explore all features freely
5. Changes reset when you logout

### Demo Credentials (if manually logging in)
- Email: `demo@example.com`
- Password: `demo123`

### What You Can Do
✅ View all expenses, income, and budgets  
✅ See analytics and charts  
✅ Create new entries (for testing)  
✅ Access all app features  

### What You Cannot Do
❌ Delete demo data  
❌ Modify existing entries  
❌ Change account settings  
❌ Save changes permanently  

**Note**: All data resets on logout!

---

## For Developers

### File Structure

```
backend/
├── api/
│   ├── demo.py              # Demo utilities & sample data
│   ├── permissions.py       # IsNotDemoUser permission
│   ├── views.py            # demo_login endpoint
│   ├── urls.py             # /auth/demo/ route
│   └── management/
│       └── commands/
│           └── setup_demo.py   # Setup command
│
frontend/
├── contexts/
│   └── AuthContext.tsx     # demoLogin() function, isDemo flag
├── pages/
│   └── AuthPage.tsx        # Demo button UI
├── components/
│   └── Layout.tsx          # Demo banner & indicators
└── lib/
    └── api.ts              # demoLogin() API method
```

### Key Components

**Backend** (`api/demo.py`)
```python
# Setup demo account with sample data
setup_demo_account()

# Also creates:
create_sample_expenses()
create_sample_income()
create_sample_budgets()
```

**Permissions** (`api/permissions.py`)
```python
class IsNotDemoUser(permissions.BasePermission):
    # Allows: GET, HEAD, OPTIONS
    # Blocks: POST, PUT, PATCH, DELETE for demo users
```

**Frontend** (`AuthContext.tsx`)
```typescript
const { user, isDemo, demoLogin, signOut } = useAuth();

// Call demoLogin() to login as demo user
await demoLogin();
```

### API Endpoint

**POST /api/auth/demo/**
```json
Response: {
  "access": "jwt_token",
  "refresh": "refresh_token", 
  "user": {
    "id": 1,
    "email": "demo@example.com",
    "first_name": "Demo User",
    "is_demo": true
  }
}
```

### Setup Demo Account

**Automatic**: Demo account is created on first demo login.

**Manual**:
```bash
cd project/backend
python manage.py setup_demo
```

### Testing

1. **Local Testing**
   ```bash
   # Backend
   cd project/backend
   python manage.py runserver
   
   # Frontend
   cd project
   npm run dev
   ```

2. **Test Flow**
   - Navigate to login page
   - Click "Try Demo"
   - Should see demo banner
   - Try creating/viewing data
   - Try modifying data (should fail)
   - Logout and login again (data should reset)

3. **Test Permissions**
   - Check `IsNotDemoUser` is blocking writes
   - Verify demo user can read all data
   - Verify demo user cannot delete data

### Customization

**Add More Sample Data**
Edit `api/demo.py`:
```python
sample_expenses = [
    {
        'title': 'Your Item',
        'amount': Decimal('99.99'),
        'category': 'Food',
        'date': today - timedelta(days=5),
    },
    # ... add more
]
```

**Change Demo Email**
Edit `api/demo.py`:
```python
DEMO_USER_EMAIL = 'your-email@example.com'
```

**Change UI Banner**
Edit `components/Layout.tsx`:
```typescript
{isDemo && (
  <div className="...">
    Custom banner message here
  </div>
)}
```

### Troubleshooting

**Demo Button Not Working**
- Check backend is running
- Check `/api/auth/demo/` endpoint is accessible
- Check browser console for errors
- Check backend logs for errors

**Demo Data Not Showing**
- Run `python manage.py setup_demo`
- Clear browser cache
- Check database connection
- Check backend logs

**Can't Modify Data (Expected)**
- This is intentional!
- Demo users are read-only by default
- Check `IsNotDemoUser` permission is applied

**Data Not Resetting on Logout**
- Check `setup_demo_account()` is called on login
- Check `localStorage.removeItem('is_demo')` on logout
- Check demo data cleanup in `create_sample_expenses()` etc.

### Performance Notes

- Demo setup takes ~300-500ms
- Uses same database as real users
- No separate infrastructure needed
- Minimal performance impact
- Data cleanup is fast (<100ms)

### Database Queries

**Check Demo User Exists**
```sql
SELECT * FROM auth_user WHERE email='demo@example.com';
```

**View Demo Data**
```sql
SELECT * FROM api_expense WHERE user_id=(SELECT id FROM auth_user WHERE email='demo@example.com');
SELECT * FROM api_income WHERE user_id=(SELECT id FROM auth_user WHERE email='demo@example.com');
SELECT * FROM api_budget WHERE user_id=(SELECT id FROM auth_user WHERE email='demo@example.com');
```

**Count Demo Records**
```sql
SELECT COUNT(*) FROM api_expense WHERE user_id=1;
SELECT COUNT(*) FROM api_income WHERE user_id=1;
SELECT COUNT(*) FROM api_budget WHERE user_id=1;
```

### Logs to Check

**Backend Logs**
```
[INFO] Demo account accessed: demo@example.com
[INFO] Demo account setup complete!
[DEBUG] Demo user login request
```

**Browser Console**
```
🎮 Starting demo login...
✅ Demo Login Response: Tokens received, demo data loaded
```

### Integration Points

1. **Authentication Flow**
   - `/api/auth/demo/` endpoint
   - Returns same token format as regular login
   - Integrates with existing token system

2. **Permission System**
   - `IsNotDemoUser` added to ExpenseViewSet, IncomeViewSet, BudgetViewSet
   - Blocks write operations for demo user
   - Allows read operations

3. **Frontend State**
   - `isDemo` flag in AuthContext
   - Stored in localStorage as `is_demo`
   - Used to show/hide demo banner

4. **UI Components**
   - Layout banner conditionally renders
   - Avatar changes color based on `isDemo`
   - Demo badge shows in sidebar

### What NOT to Change

❌ Don't change demo user ID (should be consistent)  
❌ Don't remove `IsNotDemoUser` permission  
❌ Don't auto-create demo on startup (only on first login)  
❌ Don't expose demo password in frontend code  
❌ Don't log sensitive demo data  

### What You CAN Change

✅ Sample data amounts and descriptions  
✅ Demo user name and email  
✅ Demo password  
✅ Banner styling and color  
✅ Demo badge styling  
✅ Sample data reset frequency  
✅ Number of sample records  

---

## Documentation

See `DEMO_ACCOUNT.md` for complete documentation.

See `DEMO_IMPLEMENTATION.md` for implementation details.

---

## Questions?

1. Check the code comments in `api/demo.py`
2. Review `DEMO_ACCOUNT.md` documentation
3. Check the browser/backend logs
4. Review the implementation files
