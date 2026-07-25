import api from "../../../config/api";

// Backend returns the Prisma enum key (no spaces); the dialog/hook were
// built against the old mock's space-containing strings ("On Hold").
const STATUS_MAP: Record<string, string> = {
  Active: "Active",
  OnHold: "On Hold",
  Inactive: "Inactive",
};

const REVERSE_STATUS_MAP: Record<string, string> = {
  Active: "Active",
  "On Hold": "OnHold",
  Inactive: "Inactive",
};

function mapSupplier(supplier: any) {
  if (!supplier) return supplier;
  return {
    ...supplier,
    status: STATUS_MAP[supplier.status] ?? supplier.status,
    // Prisma Decimal fields serialize as strings over JSON — useSuppliers.js
    // does real arithmetic on this (sum, sort), so it needs to be a number.
    totalSpend: Number(supplier.totalSpend),
  };
}

function toApiPayload(supplier: any) {
  const { id, ...rest } = supplier;
  return {
    ...rest,
    status: REVERSE_STATUS_MAP[supplier.status] ?? supplier.status,
  };
}

function extractErrorMessage(error: any, fallback: string) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

const suppliersService = {
  async getSuppliers() {
    const { data } = await api.get("/suppliers", { params: { limit: 500 } });
    return data.data.map(mapSupplier);
  },

  async createSupplier(supplier: any) {
    try {
      const { data } = await api.post("/suppliers", toApiPayload(supplier));
      return mapSupplier(data.data);
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Failed to create supplier."));
    }
  },

  async updateSupplier(supplier: any) {
    try {
      const { data } = await api.patch(`/suppliers/${supplier.id}`, toApiPayload(supplier));
      return mapSupplier(data.data);
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, "Failed to update supplier."));
    }
  },

  async deleteSupplier(id: number) {
    await api.delete(`/suppliers/${id}`);
    return true;
  },
};

export default suppliersService;