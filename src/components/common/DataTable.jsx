import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function DataTable({
  columns,
  rows,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
  <TableCell
    key={column.field}
    sx={{ fontWeight: 700 }}
    align={column.align || "left"}
  >
    {column.headerName}
  </TableCell>
))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow hover key={row.id}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                >
                  {column.renderCell
                    ? column.renderCell(row)
                    : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}