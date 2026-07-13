import {
  useCallback,
  useMemo,
  useState,
} from "react";

import salesService from "../../../services/sales/sales.service";
import inventoryService from "../../../services/inventory/inventory.service";
import customerService from "../../customers/services/customer.service";
import useAuth from "../../auth/hooks/useAuth";

import { DEFAULT_TAX_RATE } from "../../../constants/sales";

const WALK_IN_CUSTOMER = {
  id: "walk-in",
  fullName: "Walk-in Customer",
};

export default function useCreateSale({ onSaleCreated } = {}) {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [catalogLoading, setCatalogLoading] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [cart, setCart] = useState([]);

  const [customer, setCustomer] =
    useState(WALK_IN_CUSTOMER);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] =
    useState(DEFAULT_TAX_RATE);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setError(null);

    try {
      const [
        productData,
        customerData,
      ] = await Promise.all([
        inventoryService.getProducts(),
        customerService.getAll(),
      ]);

      setProducts(productData || []);
      setCustomers([
        WALK_IN_CUSTOMER,
        ...(customerData || []),
      ]);

    } catch (err) {
      console.error(err);
      setError(
        "Failed to load products and customers."
      );
    } finally {
      setCatalogLoading(false);
    }
  }, []);


  const addCustomerToList = (created) => {
    setCustomers((previous) => [
      ...previous,
      created,
    ]);
  };


  const resetSale = useCallback(() => {
    setCart([]);
    setCustomer(WALK_IN_CUSTOMER);

    setDiscount(0);
    setTaxRate(DEFAULT_TAX_RATE);

    setPaymentMethod("Cash");
    setNotes("");

    setError(null);
  }, []);


  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ],
    [products]
  );


  const availableProducts = useMemo(() => {
    let list = [...products];

    if (productSearch.trim()) {
      const query =
        productSearch.toLowerCase();

      list = list.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(query) ||
          product.sku
            ?.toLowerCase()
            .includes(query)
      );
    }


    if (categoryFilter !== "All") {
      list = list.filter(
        (product) =>
          product.category === categoryFilter
      );
    }


    return list;

  }, [
    products,
    productSearch,
    categoryFilter,
  ]);


  const addToCart = (product) => {
    if (!product || product.stock <= 0) {
      return;
    }


    setCart((previous) => {
      const existing = previous.find(
        (item) =>
          item.productId === product.id
      );


      if (existing) {
        if (
          existing.quantity >= product.stock
        ) {
          return previous;
        }


        return previous.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
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
      previous.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };


  const updateQuantity = (
    productId,
    quantity
  ) => {
    setCart((previous) =>
      previous.map((item) => {
        if (
          item.productId !== productId
        ) {
          return item;
        }


        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(
              Number(quantity) || 1,
              item.stock
            )
          ),
        };
      })
    );
  };


  const updateLineDiscount = (
    productId,
    lineDiscount
  ) => {
    setCart((previous) =>
      previous.map((item) =>
        item.productId === productId
          ? {
              ...item,
              discount: Math.max(
                0,
                Number(lineDiscount) || 0
              ),
            }
          : item
      )
    );
  };


  const cart_ = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        lineTotal:
          item.price *
            item.quantity -
          item.discount,
      })),
    [cart]
  );


  const subtotal = useMemo(
    () =>
      cart_.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      ),
    [cart_]
  );


  const lineDiscountsTotal = useMemo(
    () =>
      cart_.reduce(
        (sum, item) =>
          sum + item.discount,
        0
      ),
    [cart_]
  );


  const totalDiscount =
    lineDiscountsTotal +
    Number(discount || 0);


  const taxableAmount =
    Math.max(
      0,
      subtotal - totalDiscount
    );


  const tax = Math.round(
    (taxableAmount *
      Number(taxRate || 0)) /
      100
  );


  const grandTotal =
    taxableAmount + tax;


  const canCompleteSale =
    cart_.length > 0 &&
    !saving &&
    grandTotal >= 0;



  const completeSale = async () => {
    if (!canCompleteSale) {
      return null;
    }


    setSaving(true);
    setError(null);


    try {
      const today =
        new Date()
          .toISOString()
          .slice(0, 10);


      const sale =
        await salesService.createSale({
          date: today,

          customerId:
            customer.id,

          customerName:
            customer.fullName,

          cashier:
            user?.name ||
            "Unknown",

          items:
            cart_.map((item) => ({
              productId:
                item.productId,

              sku:
                item.sku,

              name:
                item.name,

              price:
                item.price,

              quantity:
                item.quantity,

              discount:
                item.discount,

              lineTotal:
                item.lineTotal,
            })),

          subtotal,

          discount:
            totalDiscount,

          taxRate:
            Number(taxRate || 0),

          tax,

          total:
            grandTotal,

          paymentMethod,

          status:
            "Completed",

          notes,
        });


      if (
        inventoryService.reduceStock
      ) {
        await Promise.all(
          cart_.map((item) =>
            inventoryService.reduceStock(
              item.productId,
              item.quantity
            )
          )
        );
      }


      resetSale();


      onSaleCreated?.(sale);


      return sale;


    } catch (err) {

      console.error(err);

      setError(
        "Failed to complete the sale. Please try again."
      );

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

    walkInCustomer:
      WALK_IN_CUSTOMER,

    addCustomerToList,

    cart:
      cart_,

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

    notes,
    setNotes,

    subtotal,
    totalDiscount,
    tax,
    grandTotal,

    saving,
    error,

    canCompleteSale,

    completeSale,
    resetSale,
  };
}