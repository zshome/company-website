const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.detail || `HTTP error: ${response.status}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  service_type?: string;
  message?: string;
  status: string;
  created_at: string;
}

export interface ContactCreate {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  service_type?: string;
  message?: string;
}

export interface News {
  id: number;
  title: string;
  summary?: string;
  content: string;
  cover_image?: string;
  category?: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

export interface Case {
  id: number;
  title: string;
  description?: string;
  location?: string;
  service_type?: string;
  area?: string;
  cover_image?: string;
  images?: string;
  is_featured: number;
  created_at: string;
}

export const api = {
  contacts: {
    create: (data: ContactCreate) => 
      fetchApi<Contact>('/contacts/', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (skip = 0, limit = 100) => 
      fetchApi<Contact[]>(`/contacts/?skip=${skip}&limit=${limit}`),
    getById: (id: number) => 
      fetchApi<Contact>(`/contacts/${id}`),
  },
  news: {
    getAll: (skip = 0, limit = 10, category?: string) => {
      const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
      if (category) params.append('category', category);
      return fetchApi<News[]>(`/news/?${params}`);
    },
    getById: (id: number) => 
      fetchApi<News>(`/news/${id}`),
  },
  cases: {
    getAll: (skip = 0, limit = 10, serviceType?: string, featured?: boolean) => {
      const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
      if (serviceType) params.append('service_type', serviceType);
      if (featured !== undefined) params.append('featured', String(featured));
      return fetchApi<Case[]>(`/cases/?${params}`);
    },
    getById: (id: number) => 
      fetchApi<Case>(`/cases/${id}`),
  },
  health: () => 
    fetchApi<{ status: string; message: string }>('/health'),
};
