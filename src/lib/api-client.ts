import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class ApiClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshPromise: Promise<{ accessToken: string; user: any }> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });

        this.client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
            // Wait for token refresh to finish before sending new requests
            if (this.refreshPromise && !config.url?.includes('/auth/refresh')) {
                await this.refreshPromise;
            }

            if (this.accessToken) {
                config.headers.Authorization = `Bearer ${this.accessToken}`;
            } else if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ API Request without token:', config.url);
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
                        const { accessToken } = await this.refreshSession();
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return this.client(originalRequest);
                    } catch {
                        this.accessToken = null;
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('auth:session-expired'));
                        }
                        return Promise.reject(error);
                    }
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

    public async refreshSession(): Promise<{ accessToken: string; user: any }> {
        if (!this.refreshPromise) {
            this.refreshPromise = this.client
                .post<{ accessToken: string; user: any }>('/auth/refresh')
                .then((res) => {
                    this.accessToken = res.data.accessToken;
                    return res.data;
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

    async uploadWithFields<T>(url: string, file: File, fields: Record<string, string>, fieldName = 'file') {
        const formData = new FormData();
        formData.append(fieldName, file);
        for (const [key, value] of Object.entries(fields)) {
            formData.append(key, value);
        }
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
}

export const apiClient = new ApiClient();
