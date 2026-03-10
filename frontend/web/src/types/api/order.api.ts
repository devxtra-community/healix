export type AdminOrderItem = {
  productId: string;
  variantId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
  attributes?: Record<string, string>;
};

export type AdminOrderAddress = {
  addressType?: 'HOME' | 'OFFICE';
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
};

export type AdminOrder = {
  orderId: string;
  orderNumber: string;
  userId: string;
  addressSnapshot?: AdminOrderAddress;
  items: AdminOrderItem[];
  subtotal: number;
  totalAmount: number;
  currency: string;
  paymentMethod?: 'STRIPE' | 'COD';
  paymentId?: string;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  fulfillmentStatus:
    | 'PLACED'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
};
