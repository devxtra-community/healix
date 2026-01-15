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

    console.log('🚨 interceptor triggered');
    console.log('status:', error.response?.status);
    console.log('url:', originalRequest?.url);
    console.log('_retry:', originalRequest?._retry);
    console.log('authType:', originalRequest?.authType);

    const isRefreshEndpoint =
      originalRequest?.url?.includes('/auth/user/refresh') ||
      originalRequest?.url?.includes('/auth/admin/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;

      const authType = originalRequest.authType;
      if (!authType) {
        console.log('authType missing');
        return Promise.reject(error);
      }

      try {
        console.log('🔄 calling refresh...');
        const res = await api.post(`/auth/${authType}/refresh`);
        console.log(res);
        console.log('refresh success');

        return api(originalRequest);
      } catch (e) {
        console.log('refresh failed', e);
        window.location.href = authType === 'admin' ? '/admin/login' : '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
