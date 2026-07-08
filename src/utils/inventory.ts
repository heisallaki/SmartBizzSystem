import { Product } from "../types/product";

export const getProductStatus = (
  quantity: number,
  reorderLevel: number
) => {
  if (quantity <= 0) return "out-of-stock";

  if (quantity <= reorderLevel) return "low-stock";

  return "in-stock";
};

export const calculateInventoryValue = (products: Product[]) =>
  products.reduce(
    (total, product) =>
      total + product.quantity * product.buyingPrice,
    0
  );

export const totalItems = (products: Product[]) =>
  products.reduce(
    (total, product) => total + product.quantity,
    0
  );