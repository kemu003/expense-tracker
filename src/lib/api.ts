import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE = 'https://expense-trackerbackend-im6h.onrender.com/api/';

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
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<AuthResponse> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors and refresh token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newTokens = await this.refreshToken();
            localStorage.setItem('access_token', newTokens.access);
            localStorage.setItem('refresh_token', newTokens.refresh);
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            window.location.href = '/'; // Redirect to auth page
            return Promise.reject(refreshError);
          }
        }

        // For other errors, create a detailed error object
        const responseData = error?.response?.data;
        
        // Check if response is HTML (error from Django, not DRF)
        let errorMessage = 'Request failed';
        if (typeof responseData === 'string' && responseData.includes('<!DOCTYPE')) {
          errorMessage = `Server Error (${error.response?.status}): Backend returned HTML error page. This may indicate a server misconfiguration or the API endpoint not found.`;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
          // Handle field errors like {"email": ["already exists"]}
          const firstKey = Object.keys(responseData)[0];
          const firstValue = responseData[firstKey];
          errorMessage = Array.isArray(firstValue) ? firstValue[0] : firstValue;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        // Create new error with detailed message
        const detailedError = new Error(errorMessage);
        (detailedError as any).response = error.response;
        (detailedError as any).status = error.response?.status;
        (detailedError as any).responseData = responseData;
        
        return Promise.reject(detailedError);
      }
    );
  }

  private async refreshToken(): Promise<AuthResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = axios.post<AuthResponse>(`${API_BASE}auth/refresh/`, {
      refresh: localStorage.getItem('refresh_token'),
    }).then(response => response.data)
      .catch(error => {
        const message = error?.response?.data?.error || error?.response?.data?.detail || 'Token refresh failed';
        throw new Error(message);
      });

    try {
      const tokens = await this.refreshPromise;
      this.refreshPromise = null;
      return tokens;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  private clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<any> {
    // Validate inputs before sending
    if (!email || !password || !name) {
      throw new Error('All fields (name, email, password) are required');
    }
    
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };
    
    console.log('📤 Register Request Payload:', payload);
    
    try {
      const response = await this.axiosInstance.post('auth/register/', payload);
      console.log('✅ Register Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Register Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const payload = {
      username: email.trim().toLowerCase(),
      password: password,
    };
    
    console.log('📤 Login Request Payload:', { username: payload.username, password: '***' });
    
    try {
      const response = await this.axiosInstance.post<AuthResponse>('auth/login/', payload);
      console.log('✅ Login Response: Tokens received');
      return response.data;
    } catch (error: any) {
      console.error('❌ Login Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  // Expense endpoints
  async getExpenses(params?: { category?: string; date_from?: string; date_to?: string; search?: string }): Promise<any[]> {
    const response = await this.axiosInstance.get('expenses/', { params });
    return response.data;
  }

  async createExpense(expense: {
    title: string;
    amount: string;
    category: string;
    date: string;
    notes: string;
  }): Promise<any> {
    const response = await this.axiosInstance.post('expenses/', expense);
    return response.data;
  }

  async updateExpense(id: number, expense: Partial<{
    title: string;
    amount: string;
    category: string;
    date: string;
    notes: string;
  }>): Promise<any> {
    const response = await this.axiosInstance.patch(`expenses/${id}/`, expense);
    return response.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.axiosInstance.delete(`expenses/${id}/`);
  }

  // Income endpoints
  async getIncome(params?: { date_from?: string; date_to?: string; search?: string }): Promise<any[]> {
    const response = await this.axiosInstance.get('income/', { params });
    return response.data;
  }

  async createIncome(income: {
    amount: string;
    source: string;
    date: string;
    notes: string;
  }): Promise<any> {
    const response = await this.axiosInstance.post('income/', income);
    return response.data;
  }

  async updateIncome(id: number, income: Partial<{
    amount: string;
    source: string;
    date: string;
    notes: string;
  }>): Promise<any> {
    const response = await this.axiosInstance.patch(`income/${id}/`, income);
    return response.data;
  }

  async deleteIncome(id: number): Promise<void> {
    await this.axiosInstance.delete(`income/${id}/`);
  }

  // Budget endpoints
  async getBudgets(params?: { month?: string }): Promise<any[]> {
    const response = await this.axiosInstance.get('budgets/', { params });
    return response.data;
  }

  async createBudget(budget: {
    category: string;
    month: string;
    amount: string;
  }): Promise<any> {
    const response = await this.axiosInstance.post('budgets/', budget);
    return response.data;
  }

  async updateBudget(id: number, budget: Partial<{
    category: string;
    month: string;
    amount: string;
  }>): Promise<any> {
    const response = await this.axiosInstance.patch(`budgets/${id}/`, budget);
    return response.data;
  }

  async deleteBudget(id: number): Promise<void> {
    await this.axiosInstance.delete(`budgets/${id}/`);
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<{
    today_expenses: string;
    week_expenses: string;
    month_expenses: string;
    month_income: string;
    balance: string;
  }> {
    const response = await this.axiosInstance.get('dashboard/stats/');
    return response.data;
  }

  // Analytics endpoints
  async getCategoryBreakdown(): Promise<Array<{
    label: string;
    value: string;
    percentage: number;
  }>> {
    const response = await this.axiosInstance.get('analytics/category_breakdown/');
    return response.data;
  }

  async getMonthlyTrends(): Promise<{
    months: string[];
    expenses: number[];
    income: number[];
  }> {
    const response = await this.axiosInstance.get('analytics/monthly_trends/');
    return response.data;
  }
}

export const apiClient = new APIClient();
export default apiClient;
