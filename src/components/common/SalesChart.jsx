import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const TEAL = "#0F766E";
const GRID_COLOR = "#E5E7EB";
const AXIS_TEXT_COLOR = "#6B7280";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          px: 2,
          py: 1.25,
          boxShadow: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ color: TEAL }}>
          Sales: KES {payload[0].value.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
}

function getTrend(data) {
  if (!data || data.length < 2) return null;

  const current = data[data.length - 1].sales;
  const previous = data[data.length - 2].sales;
  if (!previous) return null;

  const percent = ((current - previous) / previous) * 100;

  return {
    percent: Math.round(percent),
    isPositive: percent >= 0,
  };
}

function formatYAxisTick(value) {
  if (value === 0) return "KES 0";
  return `KES ${Math.round(value / 1000)}K`;
}

export default function SalesChart({ data }) {
  const trend = getTrend(data);

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 2,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Monthly Sales</Typography>

          {trend && (
            <Chip
              size="small"
              label={`${trend.isPositive ? "+" : ""}${trend.percent}%`}
              sx={{
                bgcolor: trend.isPositive ? "success.light" : "error.light",
                color: trend.isPositive ? "success.dark" : "error.dark",
                fontWeight: 700,
              }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sales performance over the last 6 months
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
              tickFormatter={formatYAxisTick}
              width={70}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: GRID_COLOR, strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke={TEAL}
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffffff", stroke: TEAL, strokeWidth: 2 }}
              activeDot={{ r: 7, fill: "#ffffff", stroke: TEAL, strokeWidth: 3 }}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}