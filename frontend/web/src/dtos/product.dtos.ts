// Frontend intent DTOs

export type CreateProductDTO = {
  categoryId: string;

  versionData: CreateProductVersionDTO;
  detailsData: CreateProductDetailsDTO;

  initialStock: number;
};

export type UpdateProductVersionDTO = {
  updateData: Partial<CreateProductVersionDTO>;
  detailsData?: Partial<CreateProductDetailsDTO>;
  initialStock: number;
};

export type CreateProductVersionDTO = {
  name: string;
  description?: string;
  brand?: string;
  tags?: string[];
  price: number;
  images: string[];
  status:
    | 'active'
    | 'inactive'
    | 'coming-soon'
    | 'discontinued'
    | 'out-of-stock';

  attributes: {
    flavor?: string;
    pack_size?: string;
    form?: 'powder' | 'capsule' | 'liquid' | 'bar';
  };
};

export type CreateProductDetailsDTO = {
  nutrition_facts?: {
    serving_size?: string;
    calories?: number;
    macros?: {
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
    };
    vitamins?: Record<string, string>;
    minerals?: Record<string, string>;
  };

  ingredients?: {
    name: string;
    origin?: string;
    organic?: boolean;
  }[];

  benefits?: string[];
  suitable_for?: string[];
};
