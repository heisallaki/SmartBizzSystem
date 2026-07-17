import PropTypes from "prop-types";

import {
  Box,
  Button,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  REPORT_DATE_FILTERS,
  REPORT_TABS,
} from "../constants/reports.constants";

import DateRangePicker from "./DateRangePicker";

function ReportsToolbar({
  selectedTab,
  dateFilter,
  customRange = { startDate: null, endDate: null },
  onTabChange,
  onDateFilterChange,
  onCustomRangeChange = () => {},
  onRefresh,
}) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        spacing={2}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <TextField
            select
            label="Date Range"
            value={dateFilter}
            onChange={(event) =>
              onDateFilterChange(event.target.value)
            }
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                md: 220,
              },
            }}
          >
            {REPORT_DATE_FILTERS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {dateFilter === "custom" && (
            <DateRangePicker
              value={customRange}
              onChange={onCustomRangeChange}
            />
          )}
        </Stack>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Stack>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, value) => onTabChange(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {REPORT_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
    </Stack>
  );
}

ReportsToolbar.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  dateFilter: PropTypes.string.isRequired,
  customRange: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  onTabChange: PropTypes.func.isRequired,
  onDateFilterChange: PropTypes.func.isRequired,
  onCustomRangeChange: PropTypes.func,
  onRefresh: PropTypes.func.isRequired,
};

export default ReportsToolbar;