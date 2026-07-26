const { Router } = require("express");
const {
  getCustomers,
  getCustomer,
  postCustomer,
  patchCustomer,
  deleteCustomer,
  getStatistics,
} = require("../controllers/customer.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listCustomersQuerySchema,
  createCustomerSchema,
  updateCustomerSchema,
} = require("../validators/customer.validator");

const router = Router();

router.use(requireAuth); // Cashiers need read access too, to pick a customer during a sale

// Must come before "/:code" — otherwise Express matches "statistics" as a
// customer code and this route is never reached.
router.get("/statistics", getStatistics);

router.get("/", validate(listCustomersQuerySchema, "query"), getCustomers);
router.get("/:code", getCustomer);

router.post("/", requireRole("Admin", "Manager"), validate(createCustomerSchema), postCustomer);
router.patch(
  "/:code",
  requireRole("Admin", "Manager"),
  validate(updateCustomerSchema),
  patchCustomer
);
router.delete("/:code", requireRole("Admin", "Manager"), deleteCustomer);

module.exports = router;