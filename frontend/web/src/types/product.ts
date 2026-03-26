export interface ApiProduct {
  _id: string;
  current_version: {
    name: string;
    price: number;
    images: string[];
  };
  stock: {
    available: number;
  };
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  variantId: string;
}
