const { Router } = require("express");
const {
  getSuppliers,
  getSupplier,
  postSupplier,
  patchSupplier,
  deleteSupplier,
} = require("../controllers/supplier.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listSuppliersQuerySchema,
  createSupplierSchema,
  updateSupplierSchema,
} = require("../validators/supplier.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin", "Manager")); // supplier contact/spend info isn't a Cashier concern

router.get("/", validate(listSuppliersQuerySchema, "query"), getSuppliers);
router.get("/:id", getSupplier);
router.post("/", validate(createSupplierSchema), postSupplier);
router.patch("/:id", validate(updateSupplierSchema), patchSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;