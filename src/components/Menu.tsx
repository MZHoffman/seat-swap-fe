import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  CssBaseline,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  ListItemText,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { AuthData } from '../auth/AuthWrapper';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),

  position: 'relative',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));
// handleLogout: React.MouseEventHandler<HTMLAnchorElement>;

export default function Menu() {
  const { user, logout } = AuthData();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogoutAndClose = () => {
    logout();
    setOpen(false);
  };

  const HamburgerMenuIcon = () => {
    return (
      <IconButton
        color='inherit'
        aria-label='open drawer'
        edge='end'
        onClick={handleDrawerOpen}
        sx={{ ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
    );
  };

  const MenuDrawer = () => {
    return (
      <>
        <Main open={open}>
          <DrawerHeader />
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
          variant='persistent'
          anchor='right'
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <Link to={`/`} onClick={handleDrawerClose}>
              <ListItem key='home' disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Home' />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to={`/`} onClick={handleDrawerClose}>
              <ListItem key='flight' disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Flights' />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to={`/account`} onClick={handleDrawerClose}>
              <ListItem key='account' disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Account' />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to={`/reviews`} onClick={handleDrawerClose}>
              <ListItem key='reviews' disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Reviews' />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to={`/defaultpreferences`} onClick={handleDrawerClose}>
              <ListItem key={'defaultpreferences'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Your Preferences' />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to={`/`} onClick={handleLogoutAndClose}>
              <ListItem key={'logout'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <Typography variant='h6' noWrap sx={{ flexGrow: 1 }} component='div'>
            Seat Swap
          </Typography>
          {user.isAuthenticated && <HamburgerMenuIcon />}
        </Toolbar>
      </AppBar>
      {user.isAuthenticated && <MenuDrawer />}
    </Box>
  );
}
