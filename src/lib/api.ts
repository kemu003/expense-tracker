const API_BASE = 'http://localhost:8000/api';

interface AuthResponse {
  access: string;
  refresh: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
}

class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid, clear it
      this.setToken(null);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.detail || 'API request failed');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const data = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: email, password }),
    });
    return data;
  }

  // Expense endpoints
  async getExpenses() {
    return this.request('/expenses/');
  }

  async createExpense(expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes: string;
  }) {
    return this.request('/expenses/', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: number, expense: Partial<any>) {
    return this.request(`/expenses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: number) {
    return this.request(`/expenses/${id}/`, {
      method: 'DELETE',
    });
  }

  // Income endpoints
  async getIncome() {
    return this.request('/income/');
  }

  async createIncome(income: {
    amount: number;
    source: string;
    date: string;
    notes: string;
  }) {
    return this.request('/income/', {
      method: 'POST',
      body: JSON.stringify(income),
    });
  }

  async updateIncome(id: number, income: Partial<any>) {
    return this.request(`/income/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(income),
    });
  }

  async deleteIncome(id: number) {
    return this.request(`/income/${id}/`, {
      method: 'DELETE',
    });
  }

  // Budget endpoints
  async getBudgets() {
    return this.request('/budgets/');
  }

  async createBudget(budget: {
    category: string;
    month: string;
    amount: number;
  }) {
    return this.request('/budgets/', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: number, budget: Partial<any>) {
    return this.request(`/budgets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(budget),
    });
  }

  async deleteBudget(id: number) {
    return this.request(`/budgets/${id}/`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats/');
  }

  // Analytics endpoints
  async getCategoryBreakdown() {
    return this.request('/analytics/category_breakdown/');
  }

  async getMonthlyTrends() {
    return this.request('/analytics/monthly_trends/');
  }
}

export const apiClient = new APIClient();
export default apiClient;
