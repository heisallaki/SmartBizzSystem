import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function mapCustomer(customer) {
  if (!customer) return customer;

  return {
    id: customer.customerCode,
    firstName: customer.firstName,
    lastName: customer.lastName,
    fullName: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    phone: customer.phone,
    company: customer.company || "",
    taxNumber: customer.taxNumber || "",
    address: {
      street: customer.addressLine || "",
      city: customer.city || "",
      county: customer.county || "",
      postalCode: customer.postalCode || "",
      country: customer.country || "Kenya",
    },
    status: customer.status,
    notes: customer.notes || "",
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    totalOrders: customer.totalOrders,
    totalSpent: Number(customer.totalSpent),
    outstandingBalance: Number(customer.outstandingBalance),
    lastPurchase: customer.lastPurchaseAt || null,
    purchaseHistory: (customer.purchaseHistory || []).map((purchase) => ({
      id: purchase.id,
      invoice: purchase.invoice,
      date: purchase.date,
      total: Number(purchase.total),
    })),
  };
}

function toApiPayload(customer) {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    company: customer.company || undefined,
    taxNumber: customer.taxNumber || undefined,
    addressLine: customer.address?.street,
    city: customer.address?.city,
    county: customer.address?.county,
    postalCode: customer.address?.postalCode || undefined,
    country: customer.address?.country,
    status: customer.status,
    notes: customer.notes || undefined,
  };
}

const customerService = {
  async getAll() {
    const { data } = await api.get("/customers", { params: { limit: 500 } });
    return data.data.map(mapCustomer);
  },

  async create(customer) {
    try {
      const { data } = await api.post("/customers", toApiPayload(customer));
      return mapCustomer(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to create customer."));
    }
  },

  async update(id, updates) {
    try {
      const { data } = await api.patch(`/customers/${id}`, toApiPayload(updates));
      return mapCustomer(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update customer."));
    }
  },

  async remove(id) {
    try {
      await api.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to delete customer."));
    }
  },

  async getStatistics() {
    try {
      const { data } = await api.get("/customers/statistics");
      return data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to load customer statistics."));
    }
  },
};

export default customerService;