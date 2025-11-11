import { API_URL } from '../utils/constants';

interface ApiError {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
}

class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: ApiError
  ) {
    super(data?.detail || statusText);
    this.name = 'HttpError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * API Client for LTI Backend
 * Provides centralized HTTP request handling
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          title: 'Unknown Error',
          status: response.status,
          detail: response.statusText,
        }));

        throw new HttpError(response.status, response.statusText, errorData);
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      // Network or other errors
      throw new HttpError(0, 'Network Error', {
        title: 'Network Error',
        status: 0,
        detail: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

export { HttpError };
export type { ApiError };
