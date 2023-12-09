import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import backgroundImage from '../../assets/home-micro.jpg';

function Home() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser);
      } else {
        history.push("/sign-in");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [history]);

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

  if (!user || !userData) {
    return null; 
  }

  const welcomeMessage = `Welcome home ${userData.name} !`;

  return (
    <Box 
      sx={{ 
        bgcolor: 'black',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh'
      }}
    >
      <Typography color="white">
        {welcomeMessage}
      </Typography>
    </Box>
  );
}

export default Home;
