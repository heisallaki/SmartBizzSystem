import customersData from "../../../data/customersData";

let customers = [...customersData];

const simulateDelay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => {
  const ids = customers
    .map((c) => Number(c.id.replace("CUS-", "")))
    .filter(Number.isFinite);

  const next = ids.length ? Math.max(...ids) + 1 : 1001;

  return `CUS-${String(next).padStart(4, "0")}`;
};

const sortCustomers = (list) =>
  [...list].sort((a, b) => a.fullName.localeCompare(b.fullName));

const customerService = {
  async getAll() {
    await simulateDelay();
    return sortCustomers(customers);
  },

  async getById(id) {
    await simulateDelay();

    return customers.find((customer) => customer.id === id) || null;
  },

  async create(customer) {
    await simulateDelay();

    const now = new Date().toISOString();

    const newCustomer = {
      id: generateId(),
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      fullName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      company: customer.company?.trim() || "",
      taxNumber: customer.taxNumber?.trim() || "",
      address: {
        street: customer.address?.street || "",
        city: customer.address?.city || "",
        county: customer.address?.county || "",
        postalCode: customer.address?.postalCode || "",
        country: customer.address?.country || "Kenya",
      },
      status: customer.status || "Active",
      notes: customer.notes || "",
      createdAt: now,
      updatedAt: now,
      totalOrders: 0,
      totalSpent: 0,
      outstandingBalance: 0,
      lastPurchase: null,
      purchaseHistory: [],
    };

    customers = [...customers, newCustomer];

    return newCustomer;
  },

  async update(id, updates) {
    await simulateDelay();

    let updatedCustomer = null;

    customers = customers.map((customer) => {
      if (customer.id !== id) return customer;

      updatedCustomer = {
        ...customer,
        ...updates,
        fullName: `${updates.firstName ?? customer.firstName} ${
          updates.lastName ?? customer.lastName
        }`,
        address: {
          ...customer.address,
          ...(updates.address || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      return updatedCustomer;
    });

    return updatedCustomer;
  },

  async remove(id) {
    await simulateDelay();

    customers = customers.filter((customer) => customer.id !== id);

    return true;
  },

  /**
   * Called by the Sales feature when a sale is completed for a registered
   * (non walk-in) customer. Updates order totals and appends a
   * purchaseHistory entry shaped for CustomerDetailsDrawer:
   * { id, invoice, date, total }.
   */
  async recordPurchase(customerId, sale) {
    await simulateDelay();

    let updatedCustomer = null;

    customers = customers.map((customer) => {
      if (customer.id !== customerId) return customer;

      const purchaseEntry = {
        id: sale.id,
        invoice: sale.invoice,
        date: sale.date,
        total: sale.total,
      };

      updatedCustomer = {
        ...customer,
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + sale.total,
        lastPurchase: sale.date,
        purchaseHistory: [purchaseEntry, ...customer.purchaseHistory],
        updatedAt: new Date().toISOString(),
      };

      return updatedCustomer;
    });

    return updatedCustomer;
  },

  async search(query) {
    await simulateDelay();

    if (!query) return sortCustomers(customers);

    const value = query.toLowerCase();

    return customers.filter((customer) =>
      [
        customer.fullName,
        customer.email,
        customer.phone,
        customer.company,
        customer.id,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  },

  async filter(filters = {}) {
    await simulateDelay();

    let results = [...customers];

    if (filters.status && filters.status !== "All") {
      results = results.filter(
        (customer) => customer.status === filters.status
      );
    }

    if (filters.city) {
      results = results.filter(
        (customer) =>
          customer.address.city.toLowerCase() ===
          filters.city.toLowerCase()
      );
    }

    return sortCustomers(results);
  },

  async getStatistics() {
    await simulateDelay();

    const active = customers.filter(
      (customer) => customer.status === "Active"
    ).length;

    const inactive = customers.length - active;

    const outstandingBalance = customers.reduce(
      (sum, customer) => sum + customer.outstandingBalance,
      0
    );

    const totalRevenue = customers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0
    );

    return {
      totalCustomers: customers.length,
      activeCustomers: active,
      inactiveCustomers: inactive,
      outstandingBalance,
      totalRevenue,
    };
  },
};

export default customerService;