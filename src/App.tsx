import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetsPage from './pages/BudgetsPage';
import SettingsPage from './pages/SettingsPage';
import { useExpenses } from './hooks/useExpenses';
import { useIncome } from './hooks/useIncome';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');

  const {
    expenses,
    loading: expLoading,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const {
    income,
    loading: incLoading,
    addIncome,
    updateIncome,
    deleteIncome,
  } = useIncome();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading your finances...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard expenses={expenses} income={income} onNavigate={setPage} />;
      case 'expenses':
        return (
          <ExpensesPage
            expenses={expenses}
            loading={expLoading}
            onAdd={addExpense}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
          />
        );
      case 'income':
        return (
          <IncomePage
            income={income}
            loading={incLoading}
            onAdd={addIncome}
            onUpdate={updateIncome}
            onDelete={deleteIncome}
          />
        );
      case 'analytics':
        return <AnalyticsPage expenses={expenses} income={income} />;
      case 'budgets':
        return <BudgetsPage expenses={expenses} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard expenses={expenses} income={income} onNavigate={setPage} />;
    }
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
