export type Product = {
  uuid: string;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  status: string;
  quantity: number;
  color?: string;
  collection?: string;
};

export const products: Product[] = [];
