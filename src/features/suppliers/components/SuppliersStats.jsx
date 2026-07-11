import Grid from "@mui/material/Grid";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import StatCard from "../../../components/common/StatCard";
import formatCurrency from "../../../utils/formatCurrency";

export default function SuppliersStats({
  totalSuppliers,
  activeSuppliers,
  totalPurchaseValue,
  onHoldSuppliers,
}) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={<LocalShippingOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Active Suppliers"
          value={activeSuppliers}
          icon={<TaskAltOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Purchase Value"
          value={formatCurrency(totalPurchaseValue)}
          icon={<PaymentsOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="On Hold"
          value={onHoldSuppliers}
          icon={<WarningAmberOutlinedIcon />}
        />
      </Grid>
    </Grid>
  );
}