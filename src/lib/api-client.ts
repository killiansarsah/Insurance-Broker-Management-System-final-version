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
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.client(originalRequest);
                    } catch {
                        this.accessToken = null;
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
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
