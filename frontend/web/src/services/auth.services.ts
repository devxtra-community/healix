import api from '../lib/axios';
import { tokenStore } from '../lib/token';

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/user/login', data);
    if (res.data.accessToken) {
      tokenStore.set(res.data.accessToken);
    }
    return res.data;
  },

  adminLogin: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/admin/login', data);
    if (res.data.accessToken) {
      tokenStore.set(res.data.accessToken);
    }
    return res.data;
  },

  logoutUser: async () => {
    await api.post('/auth/user/logout');
    tokenStore.clear();
  },
};
