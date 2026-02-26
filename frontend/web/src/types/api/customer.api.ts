export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: 'google' | 'email';
  role: 'user' | 'admin';
  isActive: boolean;
  email_verified?: boolean;
  last_login?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCustomers {
  data: Customer[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
