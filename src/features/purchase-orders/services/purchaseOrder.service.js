import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function mapPurchaseOrder(po) {
  if (!po) return po;
  return po;
}

const purchaseOrderService = {
  async getPurchaseOrders() {
    const { data } = await api.get("/purchase-orders", { params: { limit: 500 } });
    return data.data.map(mapPurchaseOrder);
  },

  async getPurchaseOrderById(id) {
    const { data } = await api.get(`/purchase-orders/${id}`);
    return mapPurchaseOrder(data.data);
  },

  async createPurchaseOrder(payload) {
    try {
      const { data } = await api.post("/purchase-orders", payload);
      return mapPurchaseOrder(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to create purchase order."));
    }
  },

  async updatePurchaseOrder(id, payload) {
    try {
      const { data } = await api.patch(`/purchase-orders/${id}`, payload);
      return mapPurchaseOrder(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update purchase order."));
    }
  },

  async updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/purchase-orders/${id}/status`, { status });
      return mapPurchaseOrder(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update purchase order status."));
    }
  },

  async receivePurchaseOrder(id, items) {
    try {
      const { data } = await api.post(`/purchase-orders/${id}/receive`, { items });
      return mapPurchaseOrder(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to record received items."));
    }
  },

  async deletePurchaseOrder(id) {
    try {
      await api.delete(`/purchase-orders/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to delete purchase order."));
    }
  },
};

export default purchaseOrderService;