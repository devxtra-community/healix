'use client';

import {
  CreateProductDTO,
  UpdateProductVersionDTO,
} from '../dtos/product.dtos';
import adminApi from '../lib/axios.admin';
import userApi from '../lib/axios.user';
import { PaginatedResponse } from '../types/api/pagination';
import { ProductApiResponse } from '../types/api/product.api';

export const productService = {
  createProduct: async (data: CreateProductDTO) => {
    const res = await adminApi.post('/product', data);
    console.log(res);
    return res.data;
  },

  getProduct: async (productId: string) => {
    const res = await userApi.get(`/product/${productId}`);
    return res.data;
  },

  getProducts: async () => {
    const res = await userApi.get('/product');
    return res.data;
  },

  getAllProductsAdmin: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ProductApiResponse>> => {
    const res = await adminApi.get('/product/admin/all', { params });
    return res.data;
  },

  createNewVersion: async (
    productId: string,
    payload: UpdateProductVersionDTO,
  ) => {
    const res = await adminApi.post(`/product/${productId}/versions`, payload);
    return res.data;
  },

  deleteProduct: async (productId: string) => {
    const res = await adminApi.delete(`/product/${productId}`);
    return res.data;
  },
};
