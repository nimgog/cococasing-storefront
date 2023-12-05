import type { Money } from './product.model';

export type ShoppingCart = {
  id: string;
  checkoutUrl: string;
  lines: LineItem[];
  originalTotalPrice?: Money;
  totalPrice: Money;
  totalQuantity: number;
};

export type LineItem = {
  id: string;
  product: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  originalTotalPrice?: Money;
  totalPrice: Money;
  quantity: number;
};
