import {
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import formatCurrency from "../../utils/formatCurrency";

const STATUS_COLOR = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "error",
};

export default function RecentTransactions({ data }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Recent Transactions
          </Typography>

          <Button size="small" variant="text" onClick={() => navigate("/sales")}>
            View All
          </Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Invoice</strong>
              </TableCell>
              <TableCell>
                <strong>Customer</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/sales")}
                >
                  <TableCell>{transaction.invoice}</TableCell>

                  <TableCell>{transaction.customer}</TableCell>

                  <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={transaction.status}
                      size="small"
                      color={STATUS_COLOR[transaction.status] || "default"}
                      sx={{
                        minWidth: 80,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}