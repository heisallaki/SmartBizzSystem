const { Router } = require("express");
const {
  getSuppliers,
  getSupplier,
  postSupplier,
  patchSupplier,
  deleteSupplier,
} = require("../controllers/supplier.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listSuppliersQuerySchema,
  createSupplierSchema,
  updateSupplierSchema,
} = require("../validators/supplier.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requirePermission("Suppliers", "view"),
  validate(listSuppliersQuerySchema, "query"),
  getSuppliers
);
router.get("/:id", requirePermission("Suppliers", "view"), getSupplier);
router.post(
  "/",
  requirePermission("Suppliers", "create"),
  validate(createSupplierSchema),
  postSupplier
);
router.patch(
  "/:id",
  requirePermission("Suppliers", "edit"),
  validate(updateSupplierSchema),
  patchSupplier
);
router.delete("/:id", requirePermission("Suppliers", "delete"), deleteSupplier);

module.exports = router;