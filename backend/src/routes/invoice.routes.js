const { Router } = require("express");
const {
  getInvoices,
  getInvoice,
  postInvoiceFromSale,
  postStandaloneInvoice,
  patchInvoice,
  postRecordPayment,
  postVoidInvoice,
  deleteInvoice,
} = require("../controllers/invoice.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listInvoicesQuerySchema,
  createFromSaleSchema,
  createStandaloneSchema,
  updateInvoiceSchema,
  recordPaymentSchema,
} = require("../validators/invoice.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listInvoicesQuerySchema, "query"), getInvoices);
router.get("/:id", getInvoice);

router.use(requireRole("Admin", "Manager"));

router.post("/from-sale", validate(createFromSaleSchema), postInvoiceFromSale);
router.post("/", validate(createStandaloneSchema), postStandaloneInvoice);
router.patch("/:id", validate(updateInvoiceSchema), patchInvoice);
router.post("/:id/payments", validate(recordPaymentSchema), postRecordPayment);
router.post("/:id/void", postVoidInvoice);
router.delete("/:id", deleteInvoice);

module.exports = router;