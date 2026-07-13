import initialProducts from "../../data/products";

let products = [...initialProducts];

// Products at or below this stock level are flagged "Low Stock".
// This is the single place product status gets auto-derived — everywhere
// else (createProduct/updateProduct) the status is set explicitly.
export const LOW_STOCK_THRESHOLD = 10;

const computeStatus = (stock: number) => {
  if (stock <= 0) return "Out of Stock";

  if (stock <= LOW_STOCK_THRESHOLD) return "Low Stock";

  return "In Stock";
};

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const inventoryService = {
  async getProducts() {
    await delay(800);

    return [...products];
  },

  async createProduct(product: any) {
    await delay(300);

    const newProduct = {
      id: Date.now(),
      ...product,
    };

    products.push(newProduct);

    return newProduct;
  },

  async updateProduct(product: any) {
    await delay(300);

    products = products.map((item) =>
      item.id === product.id
        ? product
        : item
    );

    return product;
  },

  async deleteProduct(id: number) {
    await delay(300);

    products = products.filter(
      (item) => item.id !== id
    );

    return true;
  },

  async getProductById(id: number) {
    await delay(100);

    return products.find((item) => item.id === id) || null;
  },

  /**
   * Reduces stock for each { productId, quantity } pair — called by the
   * Sales feature when a sale is completed. Recomputes each affected
   * product's status against LOW_STOCK_THRESHOLD. Stock never goes below 0.
   */
  async decrementStock(
    items: { productId: number; quantity: number }[]
  ) {
    await delay(200);

    products = products.map((product) => {
      const soldItem = items.find(
        (item) => item.productId === product.id
      );

      if (!soldItem) return product;

      const newStock = Math.max(
        0,
        product.stock - soldItem.quantity
      );

      return {
        ...product,
        stock: newStock,
        status: computeStatus(newStock),
      };
    });

    return true;
  },
};

export default inventoryService;