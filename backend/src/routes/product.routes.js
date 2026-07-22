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
const { requireAuth, requireRole } = require("../middleware/auth");
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

router.use(requireAuth); // every product route needs a logged-in user, Cashiers included

router.get("/", validate(listProductsQuerySchema, "query"), getProducts);
router.get(
  "/:id/stock-movements",
  validate(paginationQuerySchema, "query"),
  getStockMovements
);
router.get("/:id", getProduct);

router.post("/", requireRole("Admin", "Manager"), validate(createProductSchema), postProduct);
router.patch(
  "/:id",
  requireRole("Admin", "Manager"),
  validate(updateProductSchema),
  patchProduct
);
router.delete("/:id", requireRole("Admin", "Manager"), deleteProduct);
router.post(
  "/:id/adjust-stock",
  requireRole("Admin", "Manager"),
  validate(adjustStockSchema),
  postAdjustStock
);

// No requireRole here on purpose — restricted to Sale/Return/VoidReversal
// at the schema level, so any logged-in role (Cashiers included) can hit
// it as a side effect of completing/voiding a sale.
router.post(
  "/batch-adjust-stock",
  validate(batchAdjustStockSchema),
  postBatchAdjustStock
);

module.exports = router;