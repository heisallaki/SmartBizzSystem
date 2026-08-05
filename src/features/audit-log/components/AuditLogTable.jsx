import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import formatDate from "../../../utils/formatDate";

export default function AuditLogTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Date</strong>
            </TableCell>
            <TableCell>
              <strong>User</strong>
            </TableCell>
            <TableCell>
              <strong>Action</strong>
            </TableCell>
            <TableCell>
              <strong>Entity</strong>
            </TableCell>
            <TableCell>
              <strong>Details</strong>
            </TableCell>
            <TableCell>
              <strong>IP Address</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                No audit events match these filters.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  {formatDate(row.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                </TableCell>

                <TableCell>{row.userName}</TableCell>

                <TableCell>{row.actionLabel}</TableCell>

                <TableCell>
                  {row.entityId ? `${row.entityTypeLabel} #${row.entityId}` : row.entityTypeLabel}
                </TableCell>

                <TableCell>
                  {row.metadata ? (
                    <Tooltip title={JSON.stringify(row.metadata)}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "monospace",
                          display: "block",
                          maxWidth: 220,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {JSON.stringify(row.metadata)}
                      </Typography>
                    </Tooltip>
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell>{row.ipAddress || "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}