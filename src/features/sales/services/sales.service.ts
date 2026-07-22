import initialSales from "../../../data/salesData";
import inventoryService from "../../inventory/services/inventory.service";import customerService from "../../customers/services/customer.service";


let sales: any[] = [...initialSales];

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const COMPLETED_STATUS = "Completed";

const generateInvoiceNumber = () => {
  const numbers = sales
    .map((sale) => Number(sale.invoice.replace("INV-", "")))
    .filter(Number.isFinite);

  const next = numbers.length
    ? Math.max(...numbers) + 1
    : 1001;

  return `INV-${String(next).padStart(4, "0")}`;
};

/**
 * Applies a Completed sale's downstream effects: decrements stock for
 * every line item, and — for registered (non walk-in) customers —
 * records the purchase against their totals/history.
 */
async function applySaleEffects(sale: any) {
  await inventoryService.decrementStock(
    sale.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
  );

  if (sale.customerId && sale.customerId !== "walk-in") {
    await customerService.recordPurchase(sale.customerId, sale);
  }
}

/**
 * Reverses applySaleEffects — restores stock and rolls back the
 * customer's purchase record. Used by voidSale, deleteSale, and
 * updateSale (to undo the old state before applying the new one).
 */
async function reverseSaleEffects(sale: any) {
  await inventoryService.incrementStock(
    sale.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
  );

  if (sale.customerId && sale.customerId !== "walk-in") {
    await customerService.reversePurchase(sale.customerId, sale.id);
  }
}

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
   * Creates a sale, then — only if it's Completed — applies its
   * downstream effects on Inventory and Customers. Pending/Cancelled
   * sales are recorded but don't touch stock or customer totals until
   * they're edited to Completed.
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

    if (newSale.status === COMPLETED_STATUS) {
      await applySaleEffects(newSale);
    }

    return newSale;
  },

  /**
   * Full edit: line items, customer, payment, status and notes can all
   * change. Reconciles Inventory/Customers by reversing the sale's old
   * effects (if it was Completed) and re-applying its new ones (if it's
   * Completed after the edit) — so a status change alone, a line-item
   * change alone, or both together all net out correctly.
   */
  async updateSale(id: number, updates: any) {
    await delay(400);

    const existingSale = sales.find((sale) => sale.id === id);

    if (!existingSale) {
      throw new Error("Sale not found.");
    }

    const updatedSale = {
      ...existingSale,
      ...updates,
      id: existingSale.id,
      invoice: existingSale.invoice,
      createdAt: existingSale.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const wasCompleted = existingSale.status === COMPLETED_STATUS;
    const isCompleted = updatedSale.status === COMPLETED_STATUS;

    if (wasCompleted) {
      await reverseSaleEffects(existingSale);
    }

    if (isCompleted) {
      await applySaleEffects(updatedSale);
    }

    sales = sales.map((sale) =>
      sale.id === id ? updatedSale : sale
    );

    return updatedSale;
  },

  /**
   * Soft-cancels a sale: status becomes "Cancelled", and if it was
   * Completed, stock is restored and the customer's purchase record is
   * rolled back. The record itself stays in the list for audit purposes.
   */
  async voidSale(id: number) {
    await delay(300);

    const existingSale = sales.find((sale) => sale.id === id);

    if (!existingSale) {
      throw new Error("Sale not found.");
    }

    if (existingSale.status === "Cancelled") {
      return existingSale;
    }

    if (existingSale.status === COMPLETED_STATUS) {
      await reverseSaleEffects(existingSale);
    }

    const voidedSale = {
      ...existingSale,
      status: "Cancelled",
      updatedAt: new Date().toISOString(),
    };

    sales = sales.map((sale) =>
      sale.id === id ? voidedSale : sale
    );

    return voidedSale;
  },

  /**
   * Hard-removes a sale. If it was Completed, its effects are reversed
   * first so stock and customer totals stay accurate.
   */
  async deleteSale(id: number) {
    await delay(300);

    const existingSale = sales.find((sale) => sale.id === id);

    if (!existingSale) {
      throw new Error("Sale not found.");
    }

    if (existingSale.status === COMPLETED_STATUS) {
      await reverseSaleEffects(existingSale);
    }

    sales = sales.filter((sale) => sale.id !== id);

    return true;
  },
};

export default salesService;