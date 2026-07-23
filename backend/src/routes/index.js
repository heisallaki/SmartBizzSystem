// Root router mounted at /api/v1 in app.js. Every feature module gets one
// line here once it's built.

const { Router } = require("express");
const healthRoutes = require("./health.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/users", require("./user.routes"));
router.use("/roles", require("./role.routes"));

// router.use("/suppliers", require("./supplier.routes"));
// router.use("/customers", require("./customer.routes"));
// router.use("/sales", require("./sale.routes"));
// router.use("/invoices", require("./invoice.routes"));
// router.use("/purchase-orders", require("./purchaseOrder.routes"));
// router.use("/expenses", require("./expense.routes"));
// router.use("/reports", require("./report.routes"));
// router.use("/settings", require("./settings.routes"));

module.exports = router;