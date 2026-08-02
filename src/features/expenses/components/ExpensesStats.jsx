import Grid from "@mui/material/Grid";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import StatCard from "../../../components/common/StatCard";
import formatCurrency from "../../../utils/formatCurrency";

export default function ExpensesStats({
  totalExpenses,
  totalAmount,
  thisMonthAmount,
  categoryCount,
}) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={<ReceiptLongOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Amount"
          value={formatCurrency(totalAmount)}
          icon={<PaidOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="This Month"
          value={formatCurrency(thisMonthAmount)}
          icon={<CalendarMonthOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Categories"
          value={categoryCount}
          icon={<CategoryOutlinedIcon />}
        />
      </Grid>
    </Grid>
  );
}