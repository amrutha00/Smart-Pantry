import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AuthDetails from "../../AuthDetails";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from '@mui/icons-material/Settings';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ExploreIcon from '@mui/icons-material/Explore';
import logoImage from '../../../assets/logo5.png'; // Adjust the path as needed
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Header() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [state, setState] = useState({
    left: false,
  });


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget.innerText);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    let clicked = event.currentTarget.innerText;
    if(clicked == 'Profile'){
        history.push("/settings");
    }
  };

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
        fetchUserData(authUser);
      } else {
        // No user is signed in, redirect to sign-in page
        history.push("/sign-in");
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, [history]);

  // Fetch user data using the provided access token
  const fetchUserData = async (authUser) => {
    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/user";
        const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
    >
        <List>
            {['Home', 'Food Items', 'Shop', 'Discover', 'Settings'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => handleNavigation(text)}>
                        <ListItemIcon>
                            {text === 'Home' ? <HomeIcon /> : 
                            text === 'Settings' ? <SettingsIcon /> : 
                            text === 'Food Items' ? <DinnerDiningIcon /> : 
                            text === 'Shop'?<StorefrontIcon/>:
                            text === 'Discover' ? <ExploreIcon /> : 
                            <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

    const handleNavigation = (text) => {
      switch (text) {
          case 'Home':
              history.push('/home');
              break;
          case 'Food Items':
                history.push('/food-items');
              break;
          case 'Shop':
            history.push('/shop-food');
          break;
          case 'Settings':
              history.push('/settings');
              break;
          case 'Discover':
              history.push('/discover');
          default:
              break;
      }
  };
      
    // const handleUserClick = () => {
    //     history.push("/settings");
    // };

    const handleTitleClick = () => {
      history.push("/home");
  };

  return (
    <>
      <div>
        {["left"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              PaperProps={{ 
                sx: { 
                  marginTop: '64px' // Adjust this value based on your AppBar's height
                } 
              }}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }} // Add cursor style and center vertically
              onClick={handleTitleClick} // Attach the click handler
            >
              <img
                src={logoImage}
                alt="Logo"
                style={{ width: '150px', height: '50px', marginTop: '10px' }} // Adjust the width, height, and margin as needed
              />
            </Typography>




            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                >
                {userData && (
                    <Box
                        sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginRight: "20px", 
                        marginLeft: "8px", 
                        cursor: 'pointer',
                        color: 'white',
                        '&:hover': {
                            color: 'secondary.main', // or any other color
                            textDecoration: 'bold', // optional: if you want to underline on hover
                        }
                        }}
                    >
                        <PersonIcon sx={{ marginRight: 1 }}/> {/* Adjust the margin as needed */}
                        <Typography
                        variant="h6"
                        component="div"
                        >
                        {userData.name}
                        </Typography>
                    </Box>
                    )}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}><AuthDetails></AuthDetails></MenuItem>
            </Menu>








          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Header;
