import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await userApi.post('/auth/user/login', data);
    return res.data;
  },

  adminLogin: async (data: { email: string; password: string }) => {
    const res = await adminApi.post('/auth/admin/login', data);

    return res.data;
  },

  adminMe: async () => {
    return await adminApi.get('/auth/admin/me', { authType: 'admin' });
  },

  // logoutUser: async () => {
  //   await api.post('/auth/user/logout');
  //   tokenStore.clear();
  // },
};
