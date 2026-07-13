import {
  Visibility,
} from "@mui/icons-material";

import {
  Chip,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";

    case "Pending":
      return "warning";

    case "Cancelled":
      return "error";

    default:
      return "default";
  }
};

export default function SalesTable({
  rows,
  onView,
}) {
  const columns = [
    {
      field: "invoice",
      headerName: "Invoice",
      flex: 1,
      minWidth: 140,
    },

    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
    },

    {
      field: "customerName",
      headerName: "Customer",
      flex: 1.5,
      minWidth: 200,
    },

    {
      field: "paymentMethod",
      headerName: "Payment",
      flex: 1,
      minWidth: 140,
    },

    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={getStatusColor(
            params.value
          )}
        />
      ),
    },

    {
      field: "total",
      headerName: "Total",
      flex: 1,
      minWidth: 140,
      renderCell: (params) =>
        formatCurrency(params.value),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Tooltip title="View Sale">

          <IconButton
            color="primary"
            onClick={() =>
              onView?.(params.row)
            }
          >
            <Visibility />
          </IconButton>

        </Tooltip>
      ),
    },
  ];

  return (
    <Paper
      elevation={1}
      sx={{
        height: 650,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[
          10,
          25,
          50,
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
                sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}

        getRowId={(row) => row.id}

        autoHeight={false}

        density="comfortable"

        disableColumnMenu={false}

        disableColumnResize={false}
      />
    </Paper>
  );
}