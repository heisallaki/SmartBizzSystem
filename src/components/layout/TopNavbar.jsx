import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import useAuth from "../../features/auth/hooks/useAuth";
import useNotifications from "../../features/notifications/hooks/useNotifications";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function TopNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
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
        <Typography variant="h6" fontWeight={700}>
          SmartBizzSystem
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={openNotifications}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={openProfile}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={closeNotifications}
        PaperProps={{ sx: { width: 340 } }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Notifications
          </Typography>

          <Button size="small" disabled={unreadCount === 0} onClick={markAllAsRead}>
            Mark all read
          </Button>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No notifications yet" />
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                bgcolor: notification.isRead ? "transparent" : "action.hover",
              }}
            >
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="text.disabled">
                      {timeAgo(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>

      <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile}>
        <MenuItem disabled>
          <ListItemIcon>
            <PersonRoundedIcon />
          </ListItemIcon>

          <ListItemText primary={user?.name || "Account"} secondary={user?.email || ""} />
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