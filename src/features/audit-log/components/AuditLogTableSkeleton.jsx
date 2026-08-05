import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function AuditLogTableSkeleton() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[...Array(6)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width={80} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {[...Array(10)].map((_, row) => (
            <TableRow key={row}>
              {[...Array(6)].map((_, column) => (
                <TableCell key={column}>
                  <Skeleton variant="text" height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}