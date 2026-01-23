export interface ProductApiResponse {
  _id: string;
  category_id: string;

  category?: {
    _id: string;
    name: string;
    category_type: string;
    description?: string;
    health_goal: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    __v: number;
  };

  current_version_id: {
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

  details?: {
    _id: string;
    product_version_id: string;
    nutrition_facts: string;
    ingredients: string[];
    benefits: string[];
    suitable_for: string[];
  };

  is_delete: boolean;
  created_at: string;
  updated_at: string;
}
