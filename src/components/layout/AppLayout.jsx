import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",       
        overflow: "hidden",    
        bgcolor: "background.default",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",     
          overflow: "hidden",  
        }}
      >
        <TopNavbar />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 5,
            py: 4,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}