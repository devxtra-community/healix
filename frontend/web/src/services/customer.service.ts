import adminApi from '../lib/axios.admin';
import { Customer, PaginatedCustomers } from '../types/api/customer.api';

export const customerService = {
  getAllCustomersAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'Active' | 'Blocked' | 'All';
  }): Promise<PaginatedCustomers> => {
    const res = await adminApi.get('/admin/users', {
      params,
    });

    return res.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const res = await adminApi.get(`/admin/users/${id}`);
    return res.data;
  },

  toggleCustomerStatus: async (id: string): Promise<Customer> => {
    const res = await adminApi.patch(`/admin/users/${id}/toggle`);
    return res.data.data;
  },

  updateCustomer: async (
    id: string,
    payload: Partial<Customer>,
  ): Promise<Customer> => {
    const res = await adminApi.put(`/admin/users/${id}`, payload);
    return res.data.data;
  },

  getCustomerInsights: async () => {
    const res = await adminApi.get('/admin/users/insights');
    return res.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await adminApi.delete(`/admin/users/${id}`);
  },
};
