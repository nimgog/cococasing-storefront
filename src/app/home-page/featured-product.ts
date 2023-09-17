export interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  discount?: { discountPercent: number; oldPrice: number };
  price: number;
  devisa: string;
}
