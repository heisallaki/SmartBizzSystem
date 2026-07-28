const invoiceService = require("../services/invoice.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.listInvoices(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(Number(req.params.id));
  ApiResponse.ok(res, invoice);
});

const postInvoiceFromSale = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createFromSale(req.body, req.user.id);
  ApiResponse.created(res, invoice);
});

const postStandaloneInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createStandalone(req.body, req.user.id);
  ApiResponse.created(res, invoice);
});

const patchInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(Number(req.params.id), req.body, req.user.id);
  ApiResponse.ok(res, invoice);
});

const postRecordPayment = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.recordPayment(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, invoice);
});

const postVoidInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.voidInvoice(Number(req.params.id), req.user.id);
  ApiResponse.ok(res, invoice);
});

const deleteInvoiceHandler = asyncHandler(async (req, res) => {
  await invoiceService.deleteInvoice(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getInvoices,
  getInvoice,
  postInvoiceFromSale,
  postStandaloneInvoice,
  patchInvoice,
  postRecordPayment,
  postVoidInvoice,
  deleteInvoice: deleteInvoiceHandler,
};