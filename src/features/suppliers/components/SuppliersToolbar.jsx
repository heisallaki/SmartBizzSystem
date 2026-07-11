import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function SuppliersToolbar({
  search,
  onSearch,

  category,
  categories,
  onCategoryChange,

  status,
  statuses,
  onStatusChange,

  sortBy,
  sortOptions,
  onSortChange,

  onAdd,
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mb={3}
      flexWrap="wrap"
    >
      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
      >
        <TextField
          label="Search suppliers..."
          value={search}
          onChange={(event) =>
            onSearch(event.target.value)
          }
          size="small"
          sx={{ minWidth: 260 }}
        />

        <TextField
          select
          label="Category"
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          size="small"
          sx={{ minWidth: 180 }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          size="small"
          sx={{ minWidth: 180 }}
        >
          {statuses.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
          size="small"
          sx={{ minWidth: 220 }}
        >
          {sortOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onAdd}
      >
        Add Supplier
      </Button>
    </Box>
  );
}