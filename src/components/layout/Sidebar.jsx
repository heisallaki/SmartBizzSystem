import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import navigation from "../../constants/navigation";
import useAuth from "../../features/auth/hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const visibleNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary">
          SBS
        </Typography>

        <Typography variant="body2" color="text.secondary">
          SmartBizzSystem
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, mt: 1, overflowY: "auto" }}>
        {visibleNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,

                "&.active": {
                  bgcolor: "primary.main",
                  color: "white",

                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>

              <ListItemText primary={item.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}