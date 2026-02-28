// types/discount.form.types.ts

export type DiscountType = 'percentage' | 'flat';

export interface IDiscountForm {
  code: string;
  type: DiscountType;
  value: string;

  max_discount: string;
  min_order_value: string;

  usage_limit: string;
  user_limit: string;

  start_date: string;
  end_date: string;

  active: boolean;
}