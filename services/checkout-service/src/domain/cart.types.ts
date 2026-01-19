export interface CartItem {
  productId: string;
  variantId: string;

  name: string;
  image: string;

  price: number;
  quantity: number;
  subtotal: number;

  attributes: {
    flavor?: string;
    pack_size?: string;
    form?: string;
  };

  addedAt: string;
  updatedAt: string;
}

export interface CartDiscount {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  amount: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  discount?: CartDiscount;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
export interface CartItemDynamo {
  PK: string;
  SK: string;

  productId: string;
  variantId: string;

  name: string;
  image: string;

  price: number;
  quantity: number;
  subtotal: number;

  attributes: {
    flavor?: string;
    pack_size?: string;
    form?: string;
  };

  addedAt: string;
  updatedAt: string;
}
