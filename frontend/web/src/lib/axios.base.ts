import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authType?: 'user' | 'admin';
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth')
    ) {
      originalRequest._retry = true;

      try {
        const authType = originalRequest.authType;

        if (!authType) {
          return Promise.reject(error);
        }

        await api.post(`/auth/${authType}/refresh`);
        return api(originalRequest);
      } catch {
        window.location.href =
          originalRequest.authType === 'admin' ? '/admin/login' : '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
