import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import useEditSale from "../hooks/useEditSale";

import { SALE_STATUS_OPTIONS } from "../../../constants/sales";

import ProductPickerModal from "./ProductPickerModal";
import CartPanel from "./CartPanel";
import PaymentSection from "./PaymentSection";
import ReceiptPreview from "./ReceiptPreview";

export default function EditSaleDialog({
  open,
  sale,
  onClose,
  onSaleUpdated,
}) {
  const edit = useEditSale({
    sale,
    onSaleUpdated,
  });

  const {
    loadCatalog,

    saving,
    error,

    cart,
    customer,
    customers,

    status,
    setStatus,

    subtotal,
    totalDiscount,
    tax,
    grandTotal,

    saveChanges,
    resetSale,
  } = edit;

  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!open || !sale) return;

    loadCatalog();
  }, [open, sale, loadCatalog]);

  const handleClose = () => {
    if (saving) return;

    resetSale();
    onClose();
  };

  const handleSaveChanges = async () => {
    const updated = await saveChanges();

    if (!updated) return;

    onClose();
  };

  if (!sale) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Edit Sale — {sale.invoice}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={3}>
                <CartPanel
                  cart={cart}
                  onAddProduct={() => setPickerOpen(true)}
                  onRemoveItem={edit.removeFromCart}
                  onQuantityChange={edit.updateQuantity}
                  onDiscountChange={edit.updateLineDiscount}
                />

                <TextField
                  select
                  fullWidth
                  label="Sale Status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  {SALE_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <PaymentSection
                  customers={customers}
                  customer={customer}
                  onCustomerChange={edit.setCustomer}
                  paymentMethod={edit.paymentMethod}
                  onPaymentMethodChange={edit.setPaymentMethod}
                  discount={edit.discount}
                  onDiscountChange={edit.setDiscount}
                  taxRate={edit.taxRate}
                  onTaxRateChange={edit.setTaxRate}
                  notes={edit.notes}
                  onNotesChange={edit.setNotes}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
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
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={!edit.canSaveChanges}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        products={edit.availableProducts}
        categories={edit.categories}
        search={edit.productSearch}
        onSearchChange={edit.setProductSearch}
        category={edit.categoryFilter}
        onCategoryChange={edit.setCategoryFilter}
        onSelectProduct={(product) => {
          edit.addToCart(product);
          setPickerOpen(false);
        }}
        loading={edit.catalogLoading}
      />
    </>
  );
}