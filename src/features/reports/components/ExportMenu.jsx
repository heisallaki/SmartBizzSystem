import { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";

function ExportMenu({
  onPdfExport,
  onExcelExport,
  onPrint,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (callback) => {
    handleClose();

    if (callback) {
      callback();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<FileDownloadRoundedIcon />}
        onClick={handleOpen}
      >
        Export
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => handleAction(onPdfExport)}
        >
          <ListItemIcon>
            <PictureAsPdfRoundedIcon
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export PDF
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onExcelExport)}
        >
          <ListItemIcon>
            <TableChartRoundedIcon
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Export Excel
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onPrint)}
        >
          <ListItemIcon>
            <PrintRoundedIcon
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText>
            Print Report
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

ExportMenu.propTypes = {
  onPdfExport: PropTypes.func,
  onExcelExport: PropTypes.func,
  onPrint: PropTypes.func,
};

ExportMenu.defaultProps = {
  onPdfExport: undefined,
  onExcelExport: undefined,
  onPrint: undefined,
};

export default ExportMenu;