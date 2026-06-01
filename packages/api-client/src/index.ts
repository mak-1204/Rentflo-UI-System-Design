import { Tenant, PGProperty, Complaint, Lead, Invoice, MealMenu, MealBooking } from '@rentflo/types';

class RentfloApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('rentflo_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rentflo_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rentflo_token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(phone: string, code: string): Promise<{ token: string; role: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    return this.request('/tenants');
  }

  async getTenant(id: string): Promise<Tenant> {
    return this.request(`/tenants/${id}`);
  }

  // PG Properties
  async getProperties(): Promise<PGProperty[]> {
    return this.request('/properties');
  }

  async getProperty(slug: string): Promise<PGProperty> {
    return this.request(`/properties/${slug}`);
  }

  // Complaints
  async getComplaints(): Promise<Complaint[]> {
    return this.request('/complaints');
  }

  async createComplaint(data: Partial<Complaint>): Promise<Complaint> {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Leads
  async createLead(data: Partial<Lead>): Promise<Lead> {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new RentfloApiClient();
export default RentfloApiClient;
