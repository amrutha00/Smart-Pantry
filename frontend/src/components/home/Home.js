import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
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
        history.push('/sign-in');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [history]);

  const fetchUserData = async (authUser) => {
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API + '/user';
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (!user || !userData) {
    return null;
  }

  const welcomeMessage = `Welcome home ${userData.name} !`;

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden',
        m: 0,
        p: 0,
        bgcolor: 'black',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <Box sx={{ paddingTop: '100px', paddingBottom: '24px', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 5 }}>
          {welcomeMessage}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-around" alignItems="center" paddingX="5%">
        <Card sx={{ width: '45%', height: 200, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <CardActionArea onClick={() => navigateTo('/food-items')}>
            <Typography variant="h6" sx={{ textAlign: 'center', p: 3 }}>
              Food Items - Add and View food items to track your pantry.
            </Typography>
          </CardActionArea>
        </Card>
        <Card sx={{ width: '45%', height: 200, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <CardActionArea onClick={() => navigateTo('/discover')}>
            <Typography variant="h6" sx={{ textAlign: 'center', p: 3 }}>
              Discover - Find food items expiring soon and discover recipes to cook with them.
            </Typography>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
