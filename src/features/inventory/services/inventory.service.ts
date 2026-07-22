import api from "../../../config/api";

// Products at or below this stock level are flagged "Low Stock" — kept as
// a named export in case anything else imports it directly.
export const LOW_STOCK_THRESHOLD = 10;

const STATUS_MAP: Record<string, string> = {
  InStock: "In Stock",
  LowStock: "Low Stock",
  OutOfStock: "Out of Stock",
};

function mapProduct(product: any) {
  if (!product) return product;

  return {
    ...product,
    status: STATUS_MAP[product.status] ?? product.status,
    // Prisma Decimal fields serialize as strings over JSON.
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    // Flattened to a plain string for the existing category filter
    // (`new Set(products.map(p => p.category))`). categoryId kept
    // alongside in case anything needs the real FK directly.
    category: product.category?.name ?? null,
    categoryId: product.category?.id ?? product.categoryId ?? null,
    supplier: product.supplier?.name ?? null,
    supplierId: product.supplier?.id ?? product.supplierId ?? null,
  };
}

function extractErrorMessage(error: any, fallback: string) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function resolveCategoryId(categoryName?: string): Promise<number | undefined> {
  if (!categoryName || !categoryName.trim()) return undefined;

  const trimmed = categoryName.trim();
  const { data } = await api.get("/categories");
  const existing = data.data.find(
    (c: any) => c.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) return existing.id;

  const created = await api.post("/categories", { name: trimmed });
  return created.data.data.id;
}

const inventoryService = {
  async getProducts() {
    const { data } = await api.get("/products", { params: { limit: 500 } });
    return data.data.map(mapProduct);
  },

  async createProduct(product: any) {
    try {
      const { category, ...rest } = product;
      const categoryId = await resolveCategoryId(category);
      const { data } = await api.post("/products", { ...rest, categoryId });
      return mapProduct(data.data);
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Failed to create product."));
    }
  },

  
  async updateProduct(product: any) {
    try {
      const current = await inventoryService.getProductById(product.id);
      const stockDelta = current ? product.stock - current.stock : 0;

      const { stock, category, ...rest } = product;
      const categoryId = await resolveCategoryId(category);
      const { data } = await api.patch(`/products/${product.id}`, { ...rest, categoryId });
      let updated = mapProduct(data.data);

      if (stockDelta !== 0) {
        const adjustResult = await api.post(`/products/${product.id}/adjust-stock`, {
          quantityChange: stockDelta,
          movementType: "Adjustment",
          notes: "Updated via product edit form",
        });
        updated = mapProduct(adjustResult.data.data.product);
      }

      return updated;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Failed to update product."));
    }
  },

  async deleteProduct(id: number) {
    await api.delete(`/products/${id}`);
    return true;
  },

  async getProductById(id: number) {
    try {
      const { data } = await api.get(`/products/${id}`);
      return mapProduct(data.data);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new Error(extractErrorMessage(error, "Failed to load product."));
    }
  },

  async decrementStock(items: { productId: number; quantity: number }[]) {
    await api.post("/products/batch-adjust-stock", {
      items: items.map((item) => ({
        productId: item.productId,
        quantityChange: -item.quantity,
      })),
      movementType: "Sale",
    });
    return true;
  },

  async incrementStock(items: { productId: number; quantity: number }[]) {
    await api.post("/products/batch-adjust-stock", {
      items: items.map((item) => ({
        productId: item.productId,
        quantityChange: item.quantity,
      })),
      movementType: "VoidReversal",
    });
    return true;
  },
};

export default inventoryService;