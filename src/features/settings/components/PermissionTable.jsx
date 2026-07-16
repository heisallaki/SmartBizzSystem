import PropTypes from "prop-types";

import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const PERMISSIONS = [
  "view",
  "create",
  "edit",
  "delete",
];

export default function PermissionTable({
  permissions,
  onPermissionChange,
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>
              Module
            </TableCell>

            {PERMISSIONS.map((permission) => (
              <TableCell
                key={permission}
                align="center"
                sx={{
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {permission}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {permissions.map((row) => (
            <TableRow
              hover
              key={row.module}
            >
              <TableCell>
                <Typography
                  fontWeight={600}
                >
                  {row.module}
                </Typography>
              </TableCell>

              {PERMISSIONS.map((permission) => (
                <TableCell
                  key={permission}
                  align="center"
                >
                  <Checkbox
                    checked={row[permission]}
                    onChange={(event) =>
                      onPermissionChange(
                        row.module,
                        permission,
                        event.target.checked
                      )
                    }
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

PermissionTable.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string.isRequired,
      view: PropTypes.bool.isRequired,
      create: PropTypes.bool.isRequired,
      edit: PropTypes.bool.isRequired,
      delete: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onPermissionChange: PropTypes.func.isRequired,
};