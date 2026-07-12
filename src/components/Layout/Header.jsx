import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home"; // nuevo ícono

export default function Header() {
  const [anchorElUser, setAnchorEl] = React.useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);

  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  const handleOpenPrincipalMenu = (event) => setAnchorElPrincipal(event.currentTarget);
  const handleClosePrincipalMenu = () => setAnchorElPrincipal(null);
  const handleOpcionesMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);

  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Productos", link: "/producto" },
    { name: "Combos", link: "/combo" },
    { name: "Menús", link: "/menu" },
    { name: "Mantenimiento Productos", link: "/producto-table" },
  ];

  const menuIdPrincipal = "menu-appbar";

  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems.map((item, index) => (
        <Button key={index} component={Link} to={item.link} color="secondary">
          <Typography align="center">{item.name}</Typography>
        </Button>
      ))}
    </Box>
  );

  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
    </MenuItem>
  ));

  const userMenuId = "user-menu";

  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>
          <Typography variant="subtitle1" gutterBottom>
            Email usuario
          </Typography>
        </MenuItem>
        {userItems.map((setting, index) => (
          <MenuItem key={index} component={Link} to={setting.link}>
            <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  const menuOpcionesId = "badge-menu-mobile";

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primaryLight" sx={{ backgroundColor: "primaryLight.main" }}>
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>
          {/* Botón Home */}
          <Tooltip title="Home">
            <IconButton
              size="large"
              edge="end"
              component={Link}
              to="/"
              aria-label="Home"
              color="primary"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          {menuPrincipal}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
