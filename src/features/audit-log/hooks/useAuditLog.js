import { useEffect, useMemo, useState } from "react";

import auditLogService from "../services/auditLog.service";
import userService from "../../users/services/user.service";

const PAGE_SIZE = 25;

export default function useAuditLog() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);

  const [page, setPage] = useState(1);
  const [userId, setUserIdState] = useState("All");
  const [entityType, setEntityTypeState] = useState("All");
  const [action, setActionState] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadFilters = async () => {
      try {
        const [meta, userData] = await Promise.all([
          auditLogService.getAuditMeta(),
          userService.getUsers(),
        ]);

        if (!active) return;

        setActions(meta.actions);
        setEntityTypes(meta.entityTypes);
        setUsers(userData);
      } catch {
      }
    };

    loadFilters();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await auditLogService.getAuditLogs({
          page,
          limit: PAGE_SIZE,
          ...(userId !== "All" && { userId }),
          ...(entityType !== "All" && { entityType }),
          ...(action !== "All" && { action }),
        });

        if (!active) return;

        setLogs(result.items);
        setTotal(result.meta.total);
        setTotalPages(result.meta.totalPages);
      } catch (fetchError) {
        if (active) setError(fetchError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLogs();

    return () => {
      active = false;
    };
  }, [page, userId, entityType, action]);

  const userOptions = useMemo(
    () => [
      { value: "All", label: "All Users" },
      ...users.map((user) => ({ value: user.id, label: user.name })),
    ],
    [users]
  );

  const entityTypeOptions = useMemo(
    () => [{ value: "All", label: "All Entities" }, ...entityTypes],
    [entityTypes]
  );

  const actionOptions = useMemo(
    () => [{ value: "All", label: "All Actions" }, ...actions],
    [actions]
  );

  const setUserId = (value) => {
    setUserIdState(value);
    setPage(1);
  };

  const setEntityType = (value) => {
    setEntityTypeState(value);
    setPage(1);
  };

  const setAction = (value) => {
    setActionState(value);
    setPage(1);
  };

  return {
    logs,
    total,
    page,
    totalPages,
    setPage,

    loading,
    error,

    userId,
    setUserId,
    userOptions,

    entityType,
    setEntityType,
    entityTypeOptions,

    action,
    setAction,
    actionOptions,
  };
}