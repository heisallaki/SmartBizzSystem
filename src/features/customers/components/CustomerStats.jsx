import { Grid } from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import StatCard from "../../../components/common/StatCard";
import formatCurrency from "../../../utils/formatCurrency";

export default function CustomerStats({
  statistics,
}) {
  const cards = [
    {
      title: "Total Customers",
      value: statistics.totalCustomers,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      title: "Active Customers",
      value: statistics.activeCustomers,
      icon: <PersonOutlineOutlinedIcon />,
    },
    {
      title: "Inactive Customers",
      value: statistics.inactiveCustomers,
      icon: <PersonOffOutlinedIcon />,
    },
    {
      title: "Outstanding Balance",
      value: formatCurrency(
        statistics.outstandingBalance
      ),
      icon: (
        <AccountBalanceWalletOutlinedIcon />
      ),
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <StatCard
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}