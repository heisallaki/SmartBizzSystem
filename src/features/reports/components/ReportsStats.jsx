import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import { REPORT_STATS } from "../constants/reports.constants";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-KE");

const CURRENCY_FIELDS = [
  "revenue",
  "grossProfit",
  "netProfit",
  "inventoryValue",
];

function formatValue(key, value) {
  if (value == null) return "-";

  if (CURRENCY_FIELDS.includes(key)) {
    return currencyFormatter.format(value);
  }

  return numberFormatter.format(value);
}

function ReportsStats({ stats }) {
  return (
    <Grid container spacing={3}>
      {REPORT_STATS.map(({ key, title, icon: Icon }) => (
        <Grid
          key={key}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {title}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {formatValue(key, stats[key])}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <Icon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

ReportsStats.propTypes = {
  stats: PropTypes.shape({
    revenue: PropTypes.number,
    grossProfit: PropTypes.number,
    netProfit: PropTypes.number,
    totalSales: PropTypes.number,
    products: PropTypes.number,
    customers: PropTypes.number,
    inventoryValue: PropTypes.number,
    lowStockItems: PropTypes.number,
  }).isRequired,
};

export default ReportsStats;