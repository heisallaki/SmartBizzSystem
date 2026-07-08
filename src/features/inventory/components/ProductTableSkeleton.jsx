import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ProductTableSkeleton() {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 3 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {[...Array(7)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton
                  variant="text"
                  width={80}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {[...Array(8)].map((_, row) => (
            <TableRow key={row}>
              {[...Array(7)].map((_, column) => (
                <TableCell key={column}>
                  <Skeleton
                    variant="text"
                    height={30}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}