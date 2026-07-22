import initialSuppliers from "../../../data/suppliersData";

let suppliers = [...initialSuppliers];

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const suppliersService = {
  async getSuppliers() {
    await delay(800);

    return [...suppliers];
  },

  async createSupplier(supplier: any) {
    await delay(300);

    const newSupplier = {
      id: Date.now(),
      ...supplier,
    };

    suppliers.push(newSupplier);

    return newSupplier;
  },

  async updateSupplier(supplier: any) {
    await delay(300);

    suppliers = suppliers.map((item) =>
      item.id === supplier.id
        ? supplier
        : item
    );

    return supplier;
  },

  async deleteSupplier(id: number) {
    await delay(300);

    suppliers = suppliers.filter(
      (item) => item.id !== id
    );

    return true;
  },
};

export default suppliersService;