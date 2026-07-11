import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function DataTable({
  columns,
  rows,
  emptyIcon: EmptyIcon = Inventory2OutlinedIcon,
  emptyTitle = "No products found",
  emptyMessage = "Try changing your search or filters.",
}) {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(rows.length / rowsPerPage) - 1
    );

    if (page > maxPage) {
      setPage(0);
    }
  }, [rows, page, rowsPerPage]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [rows, page, rowsPerPage]);

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(
      parseInt(event.target.value, 10)
    );
    setPage(0);
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  sx={{ fontWeight: 700 }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={
                        column.align || "left"
                      }
                    >
                      {column.renderCell
                        ? column.renderCell(row)
                        : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                >
                  <Box
                    py={8}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <EmptyIcon
                      sx={{
                        fontSize: 64,
                        color: "text.secondary",
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={600}
                    >
                      {emptyTitle}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={
          handleChangeRowsPerPage
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}