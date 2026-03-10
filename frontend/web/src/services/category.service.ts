import adminApi from '../lib/axios.admin';
import { CategoryFormData } from '../types/api/category.api';

interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

type CategoryListItem = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  category_type: string;
  health_goal: string[];
  is_active: boolean;
};

type CategoryListResponse = {
  data: CategoryListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

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

  getCategoriesForAdmin: async (
    params?: GetCategoriesParams,
  ): Promise<CategoryListResponse> => {
    const fallbackLimit = 1000;
    const [activeRes, inactiveRes] = await Promise.all([
      adminApi.get<CategoryListResponse>(`/category`, {
        params: {
          search: params?.search,
          is_active: true,
          page: 1,
          limit: fallbackLimit,
        },
      }),
      adminApi.get<CategoryListResponse>(`/category`, {
        params: {
          search: params?.search,
          is_active: false,
          page: 1,
          limit: fallbackLimit,
        },
      }),
    ]);

    const merged = [...activeRes.data.data, ...inactiveRes.data.data].filter(
      (category, index, all) =>
        all.findIndex((item) => item._id === category._id) === index,
    );

    const sorted = merged.sort((a, b) => a.name.localeCompare(b.name));
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.max(1, Number(params?.limit) || 10);
    const start = (page - 1) * limit;

    return {
      data: sorted.slice(start, start + limit),
      meta: {
        total: sorted.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
      },
    };
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
