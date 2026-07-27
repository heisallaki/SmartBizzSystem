const { Router } = require("express");
const {
  getSales,
  getSale,
  postSale,
  patchSale,
  postVoidSale,
  deleteSale,
} = require("../controllers/sale.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listSalesQuerySchema,
  createSaleSchema,
  updateSaleSchema,
} = require("../validators/sale.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listSalesQuerySchema, "query"), getSales);
router.get("/:id", getSale);

// Any authenticated role — completing a sale is a Cashier's core action.
router.post("/", validate(createSaleSchema), postSale);

// Editing/voiding/deleting a historical transaction is a supervisory
// action, kept separate from the till-operator role.
router.patch("/:id", requireRole("Admin", "Manager"), validate(updateSaleSchema), patchSale);
router.post("/:id/void", requireRole("Admin", "Manager"), postVoidSale);
router.delete("/:id", requireRole("Admin", "Manager"), deleteSale);

module.exports = router;