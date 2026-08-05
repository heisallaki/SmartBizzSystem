import { Box, Pagination, Stack, Alert } from "@mui/material";

import PageHeader from "../../components/common/PageHeader";

import AuditLogToolbar from "./components/AuditLogToolbar";
import AuditLogTable from "./components/AuditLogTable";
import AuditLogTableSkeleton from "./components/AuditLogTableSkeleton";

import useAuditLog from "./hooks/useAuditLog";

export default function AuditLogPage() {
  const {
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
  } = useAuditLog();

  return (
    <Box>
      <PageHeader
        title="Audit Log"
        subtitle="A record of every change made across the system."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <AuditLogToolbar
        userId={userId}
        userOptions={userOptions}
        onUserChange={setUserId}
        entityType={entityType}
        entityTypeOptions={entityTypeOptions}
        onEntityTypeChange={setEntityType}
        action={action}
        actionOptions={actionOptions}
        onActionChange={setAction}
        total={total}
      />

      {loading ? <AuditLogTableSkeleton /> : <AuditLogTable rows={logs} />}

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}