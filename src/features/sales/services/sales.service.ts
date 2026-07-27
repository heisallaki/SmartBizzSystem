import api from "../../../config/api";

function extractErrorMessage(error: any, fallback: string) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function mapSale(sale: any) {
  return {
    ...sale,
    invoice: sale.invoiceNumber,
  };
}

const salesService = {
  async getSales() {
    const { data } = await api.get("/sales", { params: { limit: 500 } });
    return data.data.map(mapSale);
  },

  async createSale(saleInput: any) {
    try {
      const { data } = await api.post("/sales", {
        customerId: saleInput.customerId,
        items: saleInput.items,
        discount: saleInput.discount,
        taxRate: saleInput.taxRate,
        paymentMethod: saleInput.paymentMethod,
        status: saleInput.status,
        notes: saleInput.notes,
      });
      return mapSale(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to complete the sale."));
    }
  },

  async updateSale(id: number, updates: any) {
    try {
      const { data } = await api.patch(`/sales/${id}`, {
        customerId: updates.customerId,
        items: updates.items,
        discount: updates.discount,
        taxRate: updates.taxRate,
        paymentMethod: updates.paymentMethod,
        status: updates.status,
        notes: updates.notes,
      });
      return mapSale(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update the sale."));
    }
  },

  async voidSale(id: number) {
    try {
      const { data } = await api.post(`/sales/${id}/void`);
      return mapSale(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to void the sale."));
    }
  },

  async deleteSale(id: number) {
    try {
      await api.delete(`/sales/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to delete the sale."));
    }
  },
};

export default salesService;