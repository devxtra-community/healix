import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authType?: 'user' | 'admin';
    _retry?: boolean;
  }
}

const BASE_CONFIG = {
  baseURL: 'http://43.205.231.18:4000/api/v1',
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
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const status = error.response?.status;

      const isRefreshRequest =
        originalRequest?.url?.includes('/auth/user/refresh') ||
        originalRequest?.url?.includes('/auth/admin/refresh');

      const isCartRequest = originalRequest?.url?.includes('/cart');
      const isWishlistRequest = originalRequest?.url?.includes('/wishlist');

      // Ignore cart/wishlist 401 for guest users
      if ((isCartRequest || isWishlistRequest) && status === 401) {
        return Promise.resolve({
          data: null,
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: originalRequest,
        });
      }

      // Token refresh logic
      if (status === 401 && !originalRequest?._retry && !isRefreshRequest) {
        originalRequest._retry = true;

        try {
          await api.post(`/auth/${authType}/refresh`);

          // retry original request
          return api(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            window.location.href =
              authType === 'admin' ? '/admin/login' : '/login';
          }
          console.log(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
