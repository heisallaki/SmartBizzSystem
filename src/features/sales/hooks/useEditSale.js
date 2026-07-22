import {
  useCallback,
  useMemo,
  useState,
} from "react";

import salesService from "../services/sales.service";
import inventoryService from "../../inventory/services/inventory.service";
import customerService from "../../customers/services/customer.service";

import { DEFAULT_TAX_RATE } from "../../../constants/sales";

const WALK_IN_CUSTOMER = {
  id: "walk-in",
  fullName: "Walk-in Customer",
};

export default function useEditSale({ sale, onSaleUpdated } = {}) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [catalogLoading, setCatalogLoading] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [cart, setCart] = useState([]);

  const [customer, setCustomer] = useState(WALK_IN_CUSTOMER);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Completed");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadCatalog = useCallback(async () => {
    if (!sale) return;

    setCatalogLoading(true);
    setError(null);

    try {
      const [productData, customerData] = await Promise.all([
        inventoryService.getProducts(),
        customerService.getAll(),
      ]);

      const allProducts = productData || [];
      const allCustomers = [
        WALK_IN_CUSTOMER,
        ...(customerData || []),
      ];

      setProducts(allProducts);
      setCustomers(allCustomers);

      const productMap = new Map(
        allProducts.map((product) => [product.id, product])
      );

      const wasCompleted = sale.status === "Completed";

      setCart(
        sale.items.map((item) => {
          const liveStock =
            productMap.get(item.productId)?.stock ?? 0;

          return {
            productId: item.productId,
            sku: item.sku,
            name: item.name,
            price: item.price,
            // This sale already consumed item.quantity of stock if it
            // was Completed — give that headroom back for editing.
            stock: wasCompleted
              ? liveStock + item.quantity
              : liveStock,
            quantity: item.quantity,
            discount: item.discount,
          };
        })
      );

      setCustomer(
        allCustomers.find(
          (item) => item.id === sale.customerId
        ) || WALK_IN_CUSTOMER
      );

      const lineDiscounts = sale.items.reduce(
        (sum, item) => sum + (item.discount || 0),
        0
      );

      setDiscount(
        Math.max(0, (sale.discount || 0) - lineDiscounts)
      );

      setTaxRate(sale.taxRate ?? DEFAULT_TAX_RATE);
      setPaymentMethod(sale.paymentMethod || "Cash");
      setStatus(sale.status || "Completed");
      setNotes(sale.notes || "");
    } catch (err) {
      console.error(err);

      setError("Failed to load products and customers.");
    } finally {
      setCatalogLoading(false);
    }
  }, [sale]);

  const resetSale = useCallback(() => {
    setCart([]);
    setCustomer(WALK_IN_CUSTOMER);

    setDiscount(0);
    setTaxRate(DEFAULT_TAX_RATE);

    setPaymentMethod("Cash");
    setStatus("Completed");
    setNotes("");

    setError(null);
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products.map((product) => product.category).filter(Boolean)
      ),
    ],
    [products]
  );

  const availableProducts = useMemo(() => {
    let list = [...products];

    if (productSearch.trim()) {
      const query = productSearch.toLowerCase();

      list = list.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter(
        (product) => product.category === categoryFilter
      );
    }

    return list;
  }, [products, productSearch, categoryFilter]);

  const addToCart = (product) => {
    if (!product || product.stock <= 0) {
      return;
    }

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          return previous;
        }

        return previous.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previous,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: 1,
          discount: 0,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((previous) =>
      previous.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCart((previous) =>
      previous.map((item) => {
        if (item.productId !== productId) return item;

        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(Number(quantity) || 1, item.stock)
          ),
        };
      })
    );
  };

  const updateLineDiscount = (productId, lineDiscount) => {
    setCart((previous) =>
      previous.map((item) =>
        item.productId === productId
          ? {
              ...item,
              discount: Math.max(0, Number(lineDiscount) || 0),
            }
          : item
      )
    );
  };

  const cart_ = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        lineTotal: item.price * item.quantity - item.discount,
      })),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart_.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart_]
  );

  const lineDiscountsTotal = useMemo(
    () => cart_.reduce((sum, item) => sum + item.discount, 0),
    [cart_]
  );

  const totalDiscount = lineDiscountsTotal + Number(discount || 0);

  const taxableAmount = Math.max(0, subtotal - totalDiscount);

  const tax = Math.round(
    (taxableAmount * Number(taxRate || 0)) / 100
  );

  const grandTotal = taxableAmount + tax;

  const canSaveChanges =
    cart_.length > 0 && !saving && grandTotal >= 0;

  const saveChanges = async () => {
    if (!canSaveChanges || !sale) {
      return null;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await salesService.updateSale(sale.id, {
        customerId: customer.id,
        customerName: customer.fullName,

        items: cart_.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          lineTotal: item.lineTotal,
        })),

        subtotal,
        discount: totalDiscount,
        taxRate: Number(taxRate || 0),
        tax,
        total: grandTotal,

        paymentMethod,
        status,
        notes,
      });

      onSaleUpdated?.(updated);

      return updated;
    } catch (err) {
      console.error(err);

      setError("Failed to update the sale. Please try again.");

      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    loadCatalog,
    catalogLoading,

    productSearch,
    setProductSearch,

    categoryFilter,
    setCategoryFilter,

    categories,
    availableProducts,

    customers,
    customer,
    setCustomer,

    cart: cart_,

    addToCart,
    removeFromCart,

    updateQuantity,
    updateLineDiscount,

    discount,
    setDiscount,

    taxRate,
    setTaxRate,

    paymentMethod,
    setPaymentMethod,

    status,
    setStatus,

    notes,
    setNotes,

    subtotal,
    totalDiscount,
    tax,
    grandTotal,

    saving,
    error,

    canSaveChanges,

    saveChanges,
    resetSale,
  };
}