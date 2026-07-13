import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from "@mui/material";

import useCreateSale from "../hooks/useCreateSale";

import ProductPickerModal from "./ProductPickerModal";
import CartPanel from "./CartPanel";
import PaymentSection from "./PaymentSection";
import ReceiptPreview from "./ReceiptPreview";

export default function CreateSaleDialog({
  open,
  onClose,
  onSaleCreated,
}) {
  const sale = useCreateSale({
    onSaleCreated,
  });

  const {
    loadCatalog,

    saving,
    error,

    cart,
    customer,
    customers,

    subtotal,
    totalDiscount,
    tax,
    grandTotal,

    completeSale,
    resetSale,
  } = sale;

  const [pickerOpen, setPickerOpen] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    loadCatalog();
  }, [open, loadCatalog]);

  const handleClose = () => {
    if (saving) return;

    resetSale();
    onClose();
  };

  const handleCompleteSale =
    async () => {
      const created =
        await completeSale();

      if (!created) return;

      onClose();
    };

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        Create Sale
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={3}
        >
          <Grid
            size={{
              xs: 12,
              lg: 7,
            }}
          >
            <Stack spacing={3}>
                            <CartPanel
                cart={cart}
                onAddProduct={() =>
                  setPickerOpen(true)
                }
                onRemoveItem={
                  sale.removeFromCart
                }
                onQuantityChange={
                  sale.updateQuantity
                }
                onDiscountChange={
                  sale.updateLineDiscount
                }
              />

              <PaymentSection
                customers={customers}
                customer={customer}
                onCustomerChange={
                  sale.setCustomer
                }
                paymentMethod={
                  sale.paymentMethod
                }
                onPaymentMethodChange={
                  sale.setPaymentMethod
                }
                discount={sale.discount}
                onDiscountChange={
                  sale.setDiscount
                }
                taxRate={sale.taxRate}
                onTaxRateChange={
                  sale.setTaxRate
                }
                notes={sale.notes}
                onNotesChange={
                  sale.setNotes
                }
              />
            </Stack>
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 5,
            }}
          >
            <ReceiptPreview
              customer={customer}
              cart={cart}
              subtotal={subtotal}
              discount={totalDiscount}
              tax={tax}
              total={grandTotal}
            />
          </Grid>
                  </Grid>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3 }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCompleteSale}
          disabled={!sale.canCompleteSale}
        >
          {saving ? "Completing..." : "Complete Sale"}
        </Button>
      </DialogActions>
    </Dialog>

        <ProductPickerModal
      open={pickerOpen}
      onClose={() =>
        setPickerOpen(false)
      }
      products={sale.availableProducts}
      categories={sale.categories}
      search={sale.productSearch}
      onSearchChange={
        sale.setProductSearch
      }
      category={sale.categoryFilter}
      onCategoryChange={
        sale.setCategoryFilter
      }
      onSelectProduct={(product) => {
        sale.addToCart(product);
        setPickerOpen(false);
      }}
      loading={sale.catalogLoading}
    />
  </>
);
}