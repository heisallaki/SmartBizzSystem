const { Router } = require("express");
const {
  getSales,
  getSale,
  postSale,
  patchSale,
  postVoidSale,
  deleteSale,
} = require("../controllers/sale.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listSalesQuerySchema,
  createSaleSchema,
  updateSaleSchema,
} = require("../validators/sale.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requirePermission("Sales", "view"),
  validate(listSalesQuerySchema, "query"),
  getSales
);
router.get("/:id", requirePermission("Sales", "view"), getSale);

router.post("/", requirePermission("Sales", "create"), validate(createSaleSchema), postSale);

router.patch(
  "/:id",
  requirePermission("Sales", "edit"),
  validate(updateSaleSchema),
  patchSale
);
router.post("/:id/void", requirePermission("Sales", "edit"), postVoidSale);
router.delete("/:id", requirePermission("Sales", "delete"), deleteSale);

module.exports = router;