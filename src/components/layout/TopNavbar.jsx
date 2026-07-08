import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import useAuth from "../../features/auth/hooks/useAuth";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const openProfile = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const closeProfile = () => {
    setProfileAnchor(null);
  };

  const openNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const closeNotifications = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      color="inherit"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 70,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          SmartBizzSystem
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={openNotifications}>
            <Badge badgeContent={3} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={openProfile}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={closeNotifications}
      >
        <MenuItem>
          <ListItemText
            primary="New sale completed"
            secondary="2 minutes ago"
          />
        </MenuItem>

        <MenuItem>
          <ListItemText
            primary="Printer paper running low"
            secondary="15 minutes ago"
          />
        </MenuItem>

        <MenuItem>
          <ListItemText
            primary="Customer added successfully"
            secondary="Today"
          />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeProfile}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <PersonRoundedIcon />
          </ListItemIcon>

          <ListItemText
            primary="Administrator"
            secondary="admin@smartbizz.local"
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>

          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}