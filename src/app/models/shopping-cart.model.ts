import { Money } from './new-product.model';

export type ShoppingCart = {
  id: string;
  checkoutUrl: string;
  lines: LineItem[];
  originalTotalPrice: Money;
  discountedTotalPrice: Money;
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
  originalTotalPrice: Money;
  discountedTotalPrice: Money;
  quantity: number;
};
