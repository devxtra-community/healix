import api from './axios.base';

const adminApi = api.create();

adminApi.interceptors.request.use((config) => {
  config.authType = 'admin';
  return config;
});

export default adminApi;
