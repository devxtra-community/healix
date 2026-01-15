import api from './axios.base';

const userApi = api.create();

userApi.interceptors.request.use((config) => {
  config.authType = 'user';
  return config;
});

export default userApi;
