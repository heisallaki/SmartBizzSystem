import { useCallback, useEffect, useMemo, useState } from "react";
import customerService from "../services/customer.service";

const DEFAULT_FILTERS = {
  status: "All",
  city: "",
};

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    outstandingBalance: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const refreshStatistics = useCallback(async () => {
    const stats = await customerService.getStatistics();
    setStatistics(stats);
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await customerService.getAll();

      setCustomers(data);

      await refreshStatistics();
    } catch (err) {
      console.error(err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [refreshStatistics]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const createCustomer = async (payload) => {
    try {
      setSaving(true);

      const created = await customerService.create(payload);

      setCustomers((previous) =>
        [...previous, created].sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        )
      );

      await refreshStatistics();

      return created;
    } finally {
      setSaving(false);
    }
  };

  const updateCustomer = async (id, payload) => {
    try {
      setSaving(true);

      const updated = await customerService.update(id, payload);

      setCustomers((previous) =>
        previous
          .map((customer) =>
            customer.id === id ? updated : customer
          )
          .sort((a, b) => a.fullName.localeCompare(b.fullName))
      );

      await refreshStatistics();

      return updated;
    } finally {
      setSaving(false);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      setSaving(true);

      await customerService.remove(id);

      setCustomers((previous) =>
        previous.filter((customer) => customer.id !== id)
      );

      await refreshStatistics();
    } finally {
      setSaving(false);
    }
  };

  const refresh = async () => {
    await loadCustomers();
  };

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (filters.status !== "All") {
      result = result.filter(
        (customer) => customer.status === filters.status
      );
    }

    if (search.trim()) {
  const keyword = search.toLowerCase();

  result = result.filter((customer) =>
    [
      customer.id,
      customer.fullName,
      customer.email,
      customer.phone,
      customer.company,
    ]
      .filter(Boolean)
      .some((field) =>
        String(field)
          .toLowerCase()
          .includes(keyword)
      )
  );
}

    if (search.trim()) {
  const keyword = search.toLowerCase();

  result = result.filter((customer) =>
    [
      customer.id,
      customer.fullName,
      customer.email,
      customer.phone,
      customer.company,
    ]
      .filter(Boolean)
      .some((field) =>
        String(field)
          .toLowerCase()
          .includes(keyword)
      )
  );
}

    return result;
  }, [customers, filters, search]);

  const activeCustomers = useMemo(
    () =>
      filteredCustomers.filter(
        (customer) => customer.status === "Active"
      ),
    [filteredCustomers]
  );

  const inactiveCustomers = useMemo(
    () =>
      filteredCustomers.filter(
        (customer) => customer.status === "Inactive"
      ),
    [filteredCustomers]
  );

  return {
    customers: filteredCustomers,
    allCustomers: customers,

    statistics,

    loading,
    saving,
    error,

    search,
    setSearch,

    filters,
    setFilters,

    activeCustomers,
    inactiveCustomers,

    createCustomer,
    updateCustomer,
    deleteCustomer,

    refresh,
  };
}