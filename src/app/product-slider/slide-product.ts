export interface SlideProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  discount?: { discountPercent: number; oldPrice: number };
  price: number;
  devisa: string;
}
