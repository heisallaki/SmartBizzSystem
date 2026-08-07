const { Router } = require("express");
const {
  getCustomers,
  getCustomer,
  postCustomer,
  patchCustomer,
  deleteCustomer,
  getStatistics,
} = require("../controllers/customer.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listCustomersQuerySchema,
  createCustomerSchema,
  updateCustomerSchema,
} = require("../validators/customer.validator");

const router = Router();

router.use(requireAuth); 

router.get("/statistics", requirePermission("Customers", "view"), getStatistics);

router.get(
  "/",
  requirePermission("Customers", "view"),
  validate(listCustomersQuerySchema, "query"),
  getCustomers
);
router.get("/:code", requirePermission("Customers", "view"), getCustomer);

router.post(
  "/",
  requirePermission("Customers", "create"),
  validate(createCustomerSchema),
  postCustomer
);
router.patch(
  "/:code",
  requirePermission("Customers", "edit"),
  validate(updateCustomerSchema),
  patchCustomer
);
router.delete("/:code", requirePermission("Customers", "delete"), deleteCustomer);

module.exports = router;