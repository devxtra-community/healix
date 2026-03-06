import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authType?: 'user' | 'admin';
    _retry?: boolean;
  }
}
