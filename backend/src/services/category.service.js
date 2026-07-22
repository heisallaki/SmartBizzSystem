const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true } },
    },
  });
}

async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true } },
    },
  });
  if (!category) throw ApiError.notFound("Category not found.");
  return category;
}

async function assertParentExists(parentCategoryId) {
  if (parentCategoryId === undefined) return;
  const parent = await prisma.category.findUnique({ where: { id: parentCategoryId } });
  if (!parent) throw ApiError.badRequest("Selected parent category does not exist.");
}

async function createCategory(data, actorId) {
  await assertParentExists(data.parentCategoryId);

  const category = await prisma.category.create({ data });

  await logAudit({
    userId: actorId,
    action: "category.created",
    entityType: "category",
    entityId: category.id,
  });

  return category;
}

async function updateCategory(id, data, actorId) {
  await getCategoryById(id);
  await assertParentExists(data.parentCategoryId);

  if (data.parentCategoryId === id) {
    throw ApiError.badRequest("A category can't be its own parent.");
  }

  const category = await prisma.category.update({ where: { id }, data });

  await logAudit({
    userId: actorId,
    action: "category.updated",
    entityType: "category",
    entityId: id,
  });

  return category;
}

async function deleteCategory(id, actorId) {
  await getCategoryById(id);

  // Hard delete — Category has no deletedAt column. Any products pointing
  // at this category get categoryId set to NULL automatically (onDelete:
  // SetNull in schema.prisma), they don't get deleted with it.
  await prisma.category.delete({ where: { id } });

  await logAudit({
    userId: actorId,
    action: "category.deleted",
    entityType: "category",
    entityId: id,
  });
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};