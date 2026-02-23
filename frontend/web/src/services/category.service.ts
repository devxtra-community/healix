import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';
import { CategoryFormData } from '../types/api/category.api';

export const CategoryService = {
  createCategory: async (data: CategoryFormData, method: string) => {
    if (method === 'POST') {
      const res = await adminApi.post('/category', data);
      console.log(res);
      return res.data;
    }

    const res = await adminApi.put('/category', data);
    console.log(res);
    return res.data;
  },

  getCategories: async () => {
    const res = await userApi.get('/category');
    return res.data;
  },
};
