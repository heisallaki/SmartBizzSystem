import initialSales from "../../data/salesData";
import inventoryService from "../inventory/inventory.service";
import customerService from "../../features/customers/services/customer.service";

let sales: any[] = [...initialSales];

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const generateInvoiceNumber = () => {
  const numbers = sales
    .map((sale) => Number(sale.invoice.replace("INV-", "")))
    .filter(Number.isFinite);

  const next = numbers.length
    ? Math.max(...numbers) + 1
    : 1001;

  return `INV-${String(next).padStart(4, "0")}`;
};

const salesService = {
  async getSales() {
    await delay(800);

    return [...sales].sort((a, b) => b.id - a.id);
  },

  async getSaleById(id: number) {
    await delay(200);

    return sales.find((sale) => sale.id === id) || null;
  },

  /**
   * Creates a sale, then updates the two features it depends on:
   * Inventory (stock is decremented per line item) and Customers
   * (purchase history + totals are updated for registered customers).
   * Walk-in sales skip the customer update.
   */
  async createSale(saleInput: any) {
    await delay(400);

    const newSale = {
      id: Date.now(),
      invoice: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      ...saleInput,
    };

    sales = [newSale, ...sales];

    await inventoryService.decrementStock(
      newSale.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    if (
      newSale.customerId &&
      newSale.customerId !== "walk-in"
    ) {
      await customerService.recordPurchase(
        newSale.customerId,
        newSale
      );
    }

    return newSale;
  },
};

export default salesService;