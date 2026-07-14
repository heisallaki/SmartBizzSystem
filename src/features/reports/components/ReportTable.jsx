// src/features/reports/components/ReportTable.jsx

import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

function ReportTable({
  title,
  subtitle,
  columns,
  rows,
  loading = false,
  pageSize = 10,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            {subtitle}
          </Typography>
        )}

        <Box
          sx={{
            mt: 2,
            height: 500,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize,
                },
              },
            }}
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                fontWeight: 700,
              },

              "& .MuiDataGrid-cell": {
                outline: "none",
              },

              "& .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

ReportTable.propTypes = {
  title: PropTypes.string.isRequired,

  subtitle: PropTypes.string,

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,

  rows: PropTypes.arrayOf(PropTypes.object).isRequired,

  loading: PropTypes.bool,

  pageSize: PropTypes.number,
};

export default ReportTable;