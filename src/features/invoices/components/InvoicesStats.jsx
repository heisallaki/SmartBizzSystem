import Grid from "@mui/material/Grid";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import StatCard from "../../../components/common/StatCard";
import formatCurrency from "../../../utils/formatCurrency";

export default function InvoicesStats({ totalInvoices, unpaidInvoices, overdueInvoices, totalOutstanding }) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Invoices" value={totalInvoices} icon={<DescriptionOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Unpaid" value={unpaidInvoices} icon={<HourglassEmptyOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Overdue" value={overdueInvoices} icon={<ReportProblemOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Outstanding" value={formatCurrency(totalOutstanding)} icon={<AccountBalanceWalletOutlinedIcon />} />
      </Grid>
    </Grid>
  );
}