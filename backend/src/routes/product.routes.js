const { Router } = require("express");
const {
  getProducts,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
  postAdjustStock,
  postBatchAdjustStock,
  getStockMovements,
} = require("../controllers/product.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  createProductSchema,
  updateProductSchema,
  adjustStockSchema,
  batchAdjustStockSchema,
  listProductsQuerySchema,
  paginationQuerySchema,
} = require("../validators/product.validator");

const router = Router();

router.use(requireAuth); 

router.get(
  "/",
  requirePermission("Inventory", "view"),
  validate(listProductsQuerySchema, "query"),
  getProducts
);
router.get(
  "/:id/stock-movements",
  requirePermission("Inventory", "view"),
  validate(paginationQuerySchema, "query"),
  getStockMovements
);
router.get("/:id", requirePermission("Inventory", "view"), getProduct);

router.post(
  "/",
  requirePermission("Inventory", "create"),
  validate(createProductSchema),
  postProduct
);
router.patch(
  "/:id",
  requirePermission("Inventory", "edit"),
  validate(updateProductSchema),
  patchProduct
);
router.delete("/:id", requirePermission("Inventory", "delete"), deleteProduct);
router.post(
  "/:id/adjust-stock",
  requirePermission("Inventory", "edit"),
  validate(adjustStockSchema),
  postAdjustStock
);

router.post(
  "/batch-adjust-stock",
  validate(batchAdjustStockSchema),
  postBatchAdjustStock
);

module.exports = router;