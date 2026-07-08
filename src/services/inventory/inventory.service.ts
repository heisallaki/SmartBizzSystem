import initialProducts from "../../data/products";

let products = [...initialProducts];

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
};

export default inventoryService;