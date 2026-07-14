import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
 XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "../constants/reports.constants";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function RevenueChart({
  title = "Revenue Trends",
  subtitle = "",
  data,
  lines = [
    {
      key: "revenue",
      label: "Revenue",
      color: CHART_COLORS.revenue,
      currency: true,
    },
    {
      key: "profit",
      label: "Profit",
      color: CHART_COLORS.profit,
      currency: true,
    },
  ],
}) {
  const hasCurrencyLine = lines.some((line) => line.currency);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            {subtitle}
          </Typography>
        )}

        <ResponsiveContainer
          width="100%"
          height={360}
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis
              tickFormatter={(value) =>
                hasCurrencyLine
                  ? `${Math.round(value / 1000)}k`
                  : value
              }
            />

            <Tooltip
              formatter={(value, name) => {
                const line = lines.find((l) => l.label === name);

                if (line?.currency) {
                  return [
                    currencyFormatter.format(value),
                    name,
                  ];
                }

                return [value, name];
              }}
            />

            <Legend />

            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

RevenueChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,

  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
    })
  ).isRequired,

  lines: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      currency: PropTypes.bool,
    })
  ),
};

export default RevenueChart;