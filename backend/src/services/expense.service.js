const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");
const { getBusinessToday } = require("../utils/businessTime");

const PAYMENT_METHOD_TO_ENUM = {
  Cash: "Cash",
  "M-Pesa": "MPesa",
  Card: "Card",
  "Bank Transfer": "BankTransfer",
};
const ENUM_TO_PAYMENT_METHOD = {
  Cash: "Cash",
  MPesa: "M-Pesa",
  Card: "Card",
  BankTransfer: "Bank Transfer",
};

const EXPENSE_INCLUDE = {
  category: { select: { id: true, name: true } },
  supplier: { select: { id: true, name: true } },
  recorder: { select: { id: true, fullName: true } },
};

function mapExpense(expense) {
  return {
    id: expense.id,
    category: expense.category?.name ?? null,
    categoryId: expense.expenseCategoryId,
    supplierId: expense.supplier?.id ?? null,
    supplierName: expense.supplier?.name ?? null,
    description: expense.description,
    amount: Number(expense.amount),
    date: expense.expenseDate.toISOString().slice(0, 10),
    paymentMethod: ENUM_TO_PAYMENT_METHOD[expense.paymentMethod] || expense.paymentMethod,
    receiptUrl: expense.receiptUrl || "",
    recordedBy: expense.recordedBy,
    recordedByName: expense.recorder?.fullName || "Unknown",
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}

async function assertCategoryExists(expenseCategoryId) {
  if (expenseCategoryId === undefined) return;
  const category = await prisma.expenseCategory.findUnique({ where: { id: expenseCategoryId } });
  if (!category) throw ApiError.badRequest("Selected expense category does not exist.");
}

async function assertSupplierExists(supplierId) {
  if (supplierId === undefined) return;
  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) throw ApiError.badRequest("Selected supplier does not exist.");
}

async function listExpenseCategories() {
  return prisma.expenseCategory.findMany({ orderBy: { name: "asc" } });
}

async function createExpenseCategory(data, actorId) {
  const category = await prisma.expenseCategory.create({ data });

  await logAudit({
    userId: actorId,
    action: "expense_category.created",
    entityType: "expense_category",
    entityId: category.id,
  });

  return category;
}

async function listExpenses({
  search,
  categoryId,
  supplierId,
  paymentMethod,
  startDate,
  endDate,
  page,
  limit,
  sortBy,
  sortOrder,
}) {
  const where = {
    ...(categoryId !== undefined && { expenseCategoryId: categoryId }),
    ...(supplierId !== undefined && { supplierId }),
    ...(paymentMethod && { paymentMethod: PAYMENT_METHOD_TO_ENUM[paymentMethod] }),
    ...(search && {
      description: { contains: search, mode: "insensitive" },
    }),
    ...((startDate || endDate) && {
      expenseDate: {
        ...(startDate && { gte: new Date(`${startDate}T00:00:00.000Z`) }),
        ...(endDate && { lte: new Date(`${endDate}T23:59:59.999Z`) }),
      },
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      include: EXPENSE_INCLUDE,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    items: items.map(mapExpense),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getExpenseById(id) {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: EXPENSE_INCLUDE,
  });
  if (!expense) throw ApiError.notFound("Expense not found.");
  return mapExpense(expense);
}

async function createExpense(data, actorId) {
  await assertCategoryExists(data.expenseCategoryId);
  await assertSupplierExists(data.supplierId);

  const expense = await prisma.expense.create({
    data: {
      expenseCategoryId: data.expenseCategoryId,
      supplierId: data.supplierId ?? null,
      description: data.description,
      amount: data.amount,
       expenseDate: data.expenseDate
        ? new Date(`${data.expenseDate}T00:00:00.000Z`)
        : getBusinessToday(),
      paymentMethod: PAYMENT_METHOD_TO_ENUM[data.paymentMethod],
      receiptUrl: data.receiptUrl,
      recordedBy: actorId,
    },
    include: EXPENSE_INCLUDE,
  });

  await logAudit({
    userId: actorId,
    action: "expense.created",
    entityType: "expense",
    entityId: expense.id,
  });

  return mapExpense(expense);
}

async function updateExpense(id, data, actorId) {
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Expense not found.");

  await assertCategoryExists(data.expenseCategoryId);
  await assertSupplierExists(data.supplierId);

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      ...(data.expenseCategoryId !== undefined && { expenseCategoryId: data.expenseCategoryId }),
      ...(data.supplierId !== undefined && { supplierId: data.supplierId }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.expenseDate !== undefined && {
        expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
      }),
      ...(data.paymentMethod !== undefined && {
        paymentMethod: PAYMENT_METHOD_TO_ENUM[data.paymentMethod],
      }),
      ...(data.receiptUrl !== undefined && { receiptUrl: data.receiptUrl }),
    },
    include: EXPENSE_INCLUDE,
  });

  await logAudit({
    userId: actorId,
    action: "expense.updated",
    entityType: "expense",
    entityId: id,
  });

  return mapExpense(expense);
}

async function deleteExpense(id, actorId) {
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Expense not found.");

  await prisma.expense.delete({ where: { id } });

  await logAudit({
    userId: actorId,
    action: "expense.deleted",
    entityType: "expense",
    entityId: id,
  });
}

module.exports = {
  listExpenseCategories,
  createExpenseCategory,
  listExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};