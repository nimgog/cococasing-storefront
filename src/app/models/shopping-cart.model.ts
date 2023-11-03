import { Money } from './new-product.model';

export type ShoppingCart = {
  id: string;
  checkoutUrl: string;
  lines: LineItem[];
  totalCost: Money;
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
  totalCost: Money;
  quantity: number;
};
