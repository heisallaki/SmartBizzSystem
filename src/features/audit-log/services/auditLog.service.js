import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

function humanize(value) {
  return value
    .split(/[._]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapAuditLog(entry) {
  return {
    ...entry,
    actionLabel: humanize(entry.action),
    entityTypeLabel: humanize(entry.entityType),
  };
}

async function getAuditLogs(params) {
  try {
    const { data } = await api.get("/audit-logs", { params });
    return { items: data.data.map(mapAuditLog), meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load audit logs."));
  }
}

async function getAuditMeta() {
  try {
    const { data } = await api.get("/audit-logs/meta");
    return {
      actions: data.data.actions.map((action) => ({ value: action, label: humanize(action) })),
      entityTypes: data.data.entityTypes.map((type) => ({ value: type, label: humanize(type) })),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load audit log filters."));
  }
}

const auditLogService = {
  getAuditLogs,
  getAuditMeta,
};

export default auditLogService;