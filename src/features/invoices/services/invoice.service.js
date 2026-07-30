import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function mapInvoice(invoice) {
  if (!invoice) return invoice;
  return invoice;
}

const invoiceService = {
  async getInvoices() {
    const { data } = await api.get("/invoices", { params: { limit: 500 } });
    return data.data.map(mapInvoice);
  },

  async getInvoiceById(id) {
    const { data } = await api.get(`/invoices/${id}`);
    return mapInvoice(data.data);
  },

  async createFromSale(payload) {
    try {
      const { data } = await api.post("/invoices/from-sale", payload);
      return mapInvoice(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to generate invoice from sale."));
    }
  },

  async createStandalone(payload) {
    try {
      const { data } = await api.post("/invoices", payload);
      return mapInvoice(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to create invoice."));
    }
  },

  async updateInvoice(id, payload) {
    try {
      const { data } = await api.patch(`/invoices/${id}`, payload);
      return mapInvoice(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update invoice."));
    }
  },

  async recordPayment(id, payload) {
    try {
      const { data } = await api.post(`/invoices/${id}/payments`, payload);
      return mapInvoice(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to record payment."));
    }
  },

  async voidInvoice(id) {
    try {
      const { data } = await api.post(`/invoices/${id}/void`);
      return mapInvoice(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to void invoice."));
    }
  },

  async deleteInvoice(id) {
    try {
      await api.delete(`/invoices/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to delete invoice."));
    }
  },
};

export default invoiceService;