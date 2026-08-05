const { Router } = require("express");
const healthRoutes = require("./health.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", require("./auth.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/products", require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/suppliers", require("./supplier.routes"));
router.use("/customers", require("./customer.routes"));
router.use("/sales", require("./sale.routes"));
router.use("/purchase-orders", require("./purchaseOrder.routes"));
router.use("/invoices", require("./invoice.routes"));
router.use("/users", require("./user.routes"));
router.use("/roles", require("./role.routes"));
router.use("/permissions", require("./permission.routes"));
router.use("/reports", require("./report.routes"));
router.use("/expenses", require("./expense.routes"));
router.use("/settings", require("./settings.routes"));
router.use("/notifications", require("./notification.routes"));
router.use("/backups", require("./backup.routes"));
router.use("/audit-logs", require("./auditLog.routes"));

module.exports = router;