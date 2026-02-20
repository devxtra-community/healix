import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authType?: 'user' | 'admin';
    _retry?: boolean;
  }
}

const BASE_CONFIG = {
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  timeout: 30000,
} as const;

export function createApiClient(authType: 'user' | 'admin') {
  const api = axios.create(BASE_CONFIG);

  api.interceptors.request.use((config) => {
    config.authType = authType;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      const isRefreshEndpoint =
        originalRequest?.url?.includes('/auth/user/refresh') ||
        originalRequest?.url?.includes('/auth/admin/refresh');

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !isRefreshEndpoint
      ) {
        originalRequest._retry = true;

        try {
          await api.post(`/auth/${authType}/refresh`);
          return api(originalRequest);
        } catch {
          if (typeof window !== 'undefined') {
            window.location.href = authType === 'admin' ? '/admin/login' : '/login';
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
