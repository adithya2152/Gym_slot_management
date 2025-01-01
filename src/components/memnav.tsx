"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define types for pages and settings
interface Page {
  name: string;
  path: string;
}

interface Setting {
  name: string;
  path?: string; // path is optional for logout
}

const pages: Page[] = [
  { name: "Book Slots", path: "/member/bookSlots" },
  { name: "Book Trainers", path: "#" },
  { name: "Exercises", path: "/exercises" },
  // { name: "Manage Slots", path: "/admin/manageSlots" }
];

const settings: Setting[] = [
  { name: "Profile", path: "/profile" },
  { name: "Logout" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.status === 200) {
        console.log("User logged out successfully");
        toast.success("Logged out successfully");
        router.push("/"); // Redirect to login page
      } else {
        console.error("Failed to log out:", res.data.error);
        toast.error("Failed to log out", res.data.error || res.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageClick = (path: string) => {
    router.push(path);
    handleCloseNavMenu(); // Close menu after navigation
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: 60,
        marginTop: "10px",
        borderRadius: "20px",
        backgroundColor: "rgba(34, 34, 34, 0.8)",
      }}
    >
      <Toaster position="top-right" />
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between", // Distributes items across the bar
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="GymSync Logo"
            width={40}
            height={40}
            style={{ marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            GymSync
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center", // Center the navigation items
              flexGrow: 1, // Ensures this box expands to take available space
              gap: 3, // Adds spacing between items
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handlePageClick(page.path)}
                sx={{
                  color: "white",
                  fontSize: "18px",
                  textTransform: "none",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Mobile Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              aria-label="open navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handlePageClick(page.path)}
                >
                  <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* User Avatar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Admin" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name} // Using setting.name as the key
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.name === "Logout") {
                      handleLogout();
                    } else if (setting.path) {
                      router.push(setting.path); // For Profile path
                    }
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
