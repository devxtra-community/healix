export interface AddressSnapshot {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressType: 'HOME' | 'OFFICE';
}
export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  attributes?: Record<string, string>;
}
export interface OrderDiscount {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  amount: number;
}
export interface Order {
  orderId: string;
  orderNumber: string;
  userId: string;
  addressSnapshot?: AddressSnapshot;

  items: OrderItem[];
  subtotal: number;
  discount?: OrderDiscount;
  totalAmount: number;
  currency: string;
  paymentId?: string;
  reservationExpiresAt?: string;
  tax?: number;
  shippingFee?: number;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  fulfillmentStatus:
    | 'PLACED'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

  createdAt: string;
  updatedAt: string;
}
