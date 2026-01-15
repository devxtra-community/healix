import api from './axios.base';

api.interceptors.request.use((config) => {
  config.authType = 'user';
  return config;
});

export default api;
