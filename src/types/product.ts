export type ProductStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;

  category: string;

  buyingPrice: number;
  sellingPrice: number;

  quantity: number;
  reorderLevel: number;

  supplier?: string;

  description?: string;
  image?: string;

  createdAt: string;
  updatedAt: string;
}