import api from './axios.base';

api.interceptors.request.use((config) => {
  config.authType = 'admin';
  return config;
});

export default api;
