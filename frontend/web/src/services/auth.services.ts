'use client';

import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await userApi.post('/auth/user/login', data);
    return res.data;
  },

  register: async (data: { email: string; password: string }) => {
    const res = await userApi.post('/auth/user/register', data);
    return res.data;
  },

  adminLogin: async (data: { email: string; password: string }) => {
    const res = await adminApi.post('/auth/admin/login', data);
    return res.data;
  },

  adminMe: async () => {
    return await adminApi.get('/auth/admin/me');
  },
  
 userMe: async () => {
    return await userApi.get('/auth/user/me');
  },
  



  logoutUser: async () => {
    await userApi.delete('/auth/user/logout');
  },

  logoutAdmin: async () => {
    await adminApi.delete('/auth/admin/logout');
  },
};
