import Grid from "@mui/material/Grid";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import StatCard from "../../../components/common/StatCard";

export default function InventoryStats({
  totalProducts,
  totalStock,
  inventoryValue,
  lowStockItems,
}) {
  return (
    <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Products"
          value={totalProducts}
          icon={<Inventory2OutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Stock"
          value={totalStock}
          icon={<CategoryOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Inventory Value"
          value={`KSh ${inventoryValue.toLocaleString()}`}
          icon={<PaymentsOutlinedIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Low Stock"
          value={lowStockItems}
          icon={<WarningAmberOutlinedIcon />}
        />
      </Grid>
    </Grid>
  );
}