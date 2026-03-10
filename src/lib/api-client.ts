import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class ApiClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshPromise: Promise<string> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });

        this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (this.accessToken) {
                config.headers.Authorization = `Bearer ${this.accessToken}`;
            }
            return config;
        });

        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as RetryableRequest;
                const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
                
                // Handle 401 errors with token refresh
                if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.client(originalRequest);
                    } catch {
                        this.accessToken = null;
                        // For development, return mock data instead of failing
                        if (process.env.NODE_ENV === 'development') {
                            return this.getMockResponse(originalRequest.url || '');
                        }
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('auth:session-expired'));
                        }
                        return Promise.reject(error);
                    }
                }
                
                // For development, return mock data for 401/404 errors on data endpoints
                if (process.env.NODE_ENV === 'development' && 
                    (error.response?.status === 401 || error.response?.status === 404) &&
                    this.isDataEndpoint(originalRequest.url || '')) {
                    return this.getMockResponse(originalRequest.url || '');
                }
                
                return Promise.reject(error);
            },
        );
    }

    setAccessToken(token: string) {
        this.accessToken = token;
    }

    clearAccessToken() {
        this.accessToken = null;
    }

    getAccessToken() {
        return this.accessToken;
    }

    private async refreshAccessToken(): Promise<string> {
        if (!this.refreshPromise) {
            this.refreshPromise = this.client
                .post<{ accessToken: string }>('/auth/refresh')
                .then((res) => {
                    this.accessToken = res.data.accessToken;
                    return res.data.accessToken;
                })
                .finally(() => {
                    this.refreshPromise = null;
                });
        }
        return this.refreshPromise;
    }

    async get<T>(url: string, params?: Record<string, unknown>) {
        const res = await this.client.get<T>(url, { params });
        return res.data;
    }

    async post<T>(url: string, data?: unknown) {
        const res = await this.client.post<T>(url, data);
        return res.data;
    }

    async upload<T>(url: string, file: File, fieldName = 'file') {
        const formData = new FormData();
        formData.append(fieldName, file);
        const res = await this.client.post<T>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    }

    async patch<T>(url: string, data?: unknown) {
        const res = await this.client.patch<T>(url, data);
        return res.data;
    }

    async delete<T>(url: string) {
        const res = await this.client.delete<T>(url);
        return res.data;
    }

    private isDataEndpoint(url: string): boolean {
        const dataEndpoints = ['/users', '/policies', '/clients', '/claims', '/leads', '/invoices', '/carriers'];
        return dataEndpoints.some(endpoint => url.includes(endpoint));
    }

    private getMockResponse(url: string): Promise<any> {
        const mockData = this.generateMockData(url);
        return Promise.resolve({ data: mockData, status: 200, statusText: 'OK', headers: {}, config: {} });
    }

    private generateMockData(url: string): any {
        if (url.includes('/users')) {
            return {
                data: [
                    {
                        id: '1',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john.doe@example.com',
                        role: 'admin',
                        isActive: true,
                        lastLogin: new Date().toISOString(),
                        branchId: 'Main Branch'
                    },
                    {
                        id: '2',
                        firstName: 'Jane',
                        lastName: 'Smith',
                        email: 'jane.smith@example.com',
                        role: 'broker',
                        isActive: true,
                        lastLogin: new Date(Date.now() - 86400000).toISOString(),
                        branchId: 'Downtown Branch'
                    }
                ],
                total: 2
            };
        }
        
        if (url.includes('/policies')) {
            return {
                data: [
                    {
                        id: '1',
                        policyNumber: 'POL-2024-001',
                        clientName: 'ABC Company',
                        product: 'Commercial Auto',
                        status: 'active',
                        premium: 15000,
                        startDate: '2024-01-01',
                        endDate: '2024-12-31'
                    }
                ],
                total: 1
            };
        }
        
        if (url.includes('/clients')) {
            return {
                data: [
                    {
                        id: '1',
                        name: 'ABC Company',
                        email: 'contact@abc.com',
                        phone: '+1234567890',
                        type: 'corporate',
                        status: 'active'
                    }
                ],
                total: 1
            };
        }
        
        if (url.includes('/claims')) {
            return {
                data: [
                    {
                        id: '1',
                        claimNumber: 'CLM-2024-001',
                        policyNumber: 'POL-2024-001',
                        status: 'pending',
                        amount: 5000,
                        dateReported: new Date().toISOString()
                    }
                ],
                total: 1
            };
        }
        
        if (url.includes('/leads')) {
            return {
                data: [
                    {
                        id: '1',
                        name: 'New Lead',
                        email: 'lead@example.com',
                        phone: '+1234567890',
                        status: 'new',
                        source: 'website'
                    }
                ],
                total: 1
            };
        }
        
        if (url.includes('/invoices')) {
            return {
                data: [
                    {
                        id: '1',
                        invoiceNumber: 'INV-2024-001',
                        amount: 1500,
                        status: 'paid',
                        dueDate: new Date().toISOString()
                    }
                ],
                total: 1
            };
        }
        
        return { data: [], total: 0 };
    }
}

export const apiClient = new ApiClient();
