import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function mapExpense(expense) {
  if (!expense) return expense;
  return {
    ...expense,
    amount: Number(expense.amount),
  };
}

function toApiPayload(expense, expenseCategoryId) {
  return {
    expenseCategoryId,
    supplierId: expense.supplierId || undefined,
    description: expense.description,
    amount: expense.amount,
    expenseDate: expense.date,
    paymentMethod: expense.paymentMethod,
    receiptUrl: expense.receiptUrl || undefined,
  };
}

async function resolveExpenseCategoryId(categoryName) {
  const trimmed = (categoryName || "").trim();

  const { data } = await api.get("/expenses/categories");

  const existing = data.data.find(
    (category) => category.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) return existing.id;

  const created = await api.post("/expenses/categories", { name: trimmed });
  return created.data.data.id;
}

const expenseService = {
  async getExpenses() {
    const { data } = await api.get("/expenses", { params: { limit: 500 } });
    return data.data.map(mapExpense);
  },

  async getCategories() {
    const { data } = await api.get("/expenses/categories");
    return data.data;
  },

  async createExpense(expense) {
    try {
      const expenseCategoryId = await resolveExpenseCategoryId(expense.category);
      const { data } = await api.post("/expenses", toApiPayload(expense, expenseCategoryId));
      return mapExpense(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to create expense."));
    }
  },

  async updateExpense(expense) {
    try {
      const expenseCategoryId = await resolveExpenseCategoryId(expense.category);
      const { data } = await api.patch(
        `/expenses/${expense.id}`,
        toApiPayload(expense, expenseCategoryId)
      );
      return mapExpense(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update expense."));
    }
  },

  async deleteExpense(id) {
    await api.delete(`/expenses/${id}`);
    return true;
  },
};

export default expenseService;