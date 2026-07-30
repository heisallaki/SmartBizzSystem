import Grid from "@mui/material/Grid";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import StatCard from "../../../components/common/StatCard";
import formatCurrency from "../../../utils/formatCurrency";

export default function PurchaseOrdersStats({
  totalPurchaseOrders,
  openPurchaseOrders,
  receivedPurchaseOrders,
  totalPurchaseValue,
}) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Purchase Orders" value={totalPurchaseOrders} icon={<ReceiptLongOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Open" value={openPurchaseOrders} icon={<PendingActionsOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Received" value={receivedPurchaseOrders} icon={<TaskAltOutlinedIcon />} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Value" value={formatCurrency(totalPurchaseValue)} icon={<PaidOutlinedIcon />} />
      </Grid>
    </Grid>
  );
}