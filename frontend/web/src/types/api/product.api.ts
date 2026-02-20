export interface ProductApiResponse {
  _id: string;
  category_id: string;
  current_version_id:
    | string
    | {
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
        attributes: {
          flavor?: string;
          pack_size?: string;
          form?: string;
        };
      };

  category?: {
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
  };

  current_version?: {
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
    attributes: {
      flavor?: string;
      pack_size?: string;
      form?: string;
    };
  };

  stock?: {
    _id: string;
    product_version_id: string;
    available: number;
    reserved: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };

  is_delete: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
}
