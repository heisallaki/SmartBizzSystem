import api from "../../../config/api";

// Products at or below this stock level are flagged "Low Stock" — kept as
// a named export in case anything else imports it directly. The backend's
// computeStatus() in product.service.js uses this exact same threshold.
export const LOW_STOCK_THRESHOLD = 10;

function extractErrorMessage(error: any, fallback: string) {
  return error.response?.data?.message || fallback;
}

const inventoryService = {
  
  async getProducts() {
    const { data } = await api.get("/products", { params: { limit: 500 } });
    return data.data;
  },

  async createProduct(product: any) {
    const { data } = await api.post("/products", product);
    return data.data;
  },

  // The backend only allows stock to change through /adjust-stock (so
  // every change leaves an audit trail) — it silently ignores a `stock`
  // field sent to the general update. This diffs the incoming stock
  // against the current value and fires a follow-up adjustment if it
  // changed, so the existing Edit Product dialog keeps working exactly
  // as it did against the mock, without you needing to change it.
  async updateProduct(product: any) {
    const current = await inventoryService.getProductById(product.id);
    const stockDelta = current ? product.stock - current.stock : 0;

    const { stock, ...rest } = product;
    const { data } = await api.patch(`/products/${product.id}`, rest);
    let updated = data.data;

    if (stockDelta !== 0) {
      const adjustResult = await api.post(`/products/${product.id}/adjust-stock`, {
        quantityChange: stockDelta,
        movementType: "Adjustment",
        notes: "Updated via product edit form",
      });
      updated = adjustResult.data.data.product;
    }

    return updated;
  },

  async deleteProduct(id: number) {
    await api.delete(`/products/${id}`);
    return true;
  },

  async getProductById(id: number) {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new Error(extractErrorMessage(error, "Failed to load product."));
    }
  },

  /**
   * Reduces stock for each { productId, quantity } pair — called by the
   * Sales feature when a sale is completed. Now writes through to the real
   * backend in one all-or-nothing request instead of mutating a local
   * mock array.
   */
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

  /**
   * Restores stock for each { productId, quantity } pair — called when a
   * sale is voided, deleted, or edited. Mirrors decrementStock.
   */
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