import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

function Home() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

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
      const response = await fetch("http://localhost:3000/api/user/", {
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
    return null; // Render nothing until user is authenticated and user data is fetched
  }

  // Display the user's name in the welcome message
  const welcomeMessage = `Welcome home ${userData.name} !`;

  return (
    <Box bgcolor="black" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">

      <Typography
        color="white"
      >
        {welcomeMessage}
      </Typography>
    </Box>
  );
}

export default Home;
