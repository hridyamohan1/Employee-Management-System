import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate, Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* 🔝 Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#18b6a1",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Left Title */}
          <Typography variant="h6">
            Employee MS
          </Typography>

          {/* Center (optional welcome) */}
          <Typography variant="body1">
            Welcome, Admin
          </Typography>

          {/* Right Logout Button */}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: "#0f7c6b",
              textTransform: "none",
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "#0c5f53",
              },
            }}
          >
            Logout
          </Button>

        </Toolbar>
      </AppBar>

      {/* Sidebar + Content remains same */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        <Toolbar />
        {/* sidebar items */}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}