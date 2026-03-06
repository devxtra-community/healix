export interface ProductAttributes {
  flavor?: string;
  pack_size?: string;
  form?: string;
}

export interface ProductVersion {
  _id: string;
  product_id: string;
  version: number;
  name: string;
  description?: string;
  brand?: string;
  tags?: string[];
  price: number;
  images: string[];
  status: string;
  attributes: ProductAttributes;
}

export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  category_type: string;
  health_goal: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  __v: number;
}

export interface ProductStock {
  _id: string;
  product_version_id: string;
  available: number;
  reserved: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductApiResponse {
  _id: string;
  category_id: string;
  current_version_id: string | ProductVersion;
  current_version?: ProductVersion;
  category?: ProductCategory;
  stock?: ProductStock;
  is_delete: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}
