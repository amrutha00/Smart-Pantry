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


function Header() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [state, setState] = useState({
    left: false,
  });

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
            {['Home', 'Food Items', 'Settings'].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => handleNavigation(text)}>
                        <ListItemIcon>
                            {text === 'Home' ? <HomeIcon /> : text === 'Settings' ? <SettingsIcon /> : <MailIcon />}
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
          case 'Settings':
              history.push('/settings');
              break;
          default:
              break;
      }
  };
      
    const handleUserClick = () => {
        history.push("/settings");
    };

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
                sx={{ flexGrow: 1, cursor: 'pointer' }} // Add cursor style
                onClick={handleTitleClick} // Attach the click handler
            >
                FreshPlate
            </Typography>
            {/* Display the user's name */}
            {userData && (
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ 
                        marginRight: "20px", 
                        marginLeft: "8px", 
                        cursor: 'pointer',
                        '&:hover': {
                            color: 'secondary.main', // or any other color
                            textDecoration: 'bold', // optional: if you want to underline on hover
                        }
                    }}
                    onClick={handleUserClick}
                >
                    {userData.name}
                </Typography>
            )}
            {/* <Button color="inherit">Login</Button> */}
            <AuthDetails></AuthDetails>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Header;
