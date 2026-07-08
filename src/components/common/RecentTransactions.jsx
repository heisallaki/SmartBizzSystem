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

export default function RecentTransactions({ data }) {
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
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Recent Transactions
          </Typography>

          <Button
            size="small"
            variant="text"
          >
            View All
          </Button>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Invoice</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell align="right"><strong>Amount</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((transaction) => (
              <TableRow
                key={transaction.id}
                hover
                sx={{
                  cursor: "pointer",
                }}
              >
                <TableCell>{transaction.id}</TableCell>

                <TableCell>{transaction.customer}</TableCell>

                <TableCell align="right">
                  {transaction.amount}
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={transaction.status}
                    size="small"
                    color={
                      transaction.status === "Paid"
                        ? "success"
                        : transaction.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                    sx={{
                      minWidth: 80,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}