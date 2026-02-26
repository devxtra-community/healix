import adminApi from '../lib/axios.admin';
import { CategoryFormData } from '../types/api/category.api';

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export const CategoryService = {
  createCategory: async (data: CategoryFormData) => {
    const res = await adminApi.post('/category', data);
    return res.data;
  },

  updateCategory: async (id: string, data: CategoryFormData) => {
    const res = await adminApi.patch(`/category/${id}`, data);
    return res.data;
  },

  getCategories: async (params?: GetCategoriesParams) => {
    const res = await adminApi.get(`/category`, {
      params,
    });
    return res.data; // returns { data, meta }
  },

  getCategoryById: async (id: string) => {
    const res = await adminApi.get(`/category/${id}`);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await adminApi.delete(`/category/${id}`);
    return res.data;
  },

  restoreCategory: async (id: string) => {
    const res = await adminApi.patch(`/category/${id}/restore`);
    return res.data;
  },
};
