import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { Box, Card, CardActionArea, Typography, CardContent} from '@mui/material';
import backgroundImage from '../../assets/home-micro.jpg';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        setUser(authUser);
        // fetchUserData(authUser);
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

  // if (!user || !userData) {
  //   return null;
  // }

  // const welcomeMessage = `Welcome home ${userData.name} !`;

  const welcomeMessage = `Welcome Home!`;

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
      <Card onClick={() => navigateTo('/food-items')} sx={{ width: '45%', height: 200, '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <CardContent>
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial', color: 'white' }}>
              Food Items
            </Typography>
            <Box sx={{ marginTop: 2 }}> {/* Adjust the top margin as needed */}
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Add and View food items to track your pantry
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card onClick={() => navigateTo('/discover')} sx={{ width: '45%', height: 200, '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <CardContent>
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial', color: 'white' }}>
              Discover
            </Typography>
            <Box sx={{ marginTop: 2 }}> {/* Adjust the top margin as needed */}
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Find food expiring soon and Discover Recipes with them
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" justifyContent="space-around" alignItems="center" paddingX="5%" paddingY="2%">
        <Card onClick={() => navigateTo('/shop-food')} sx={{ width: '45%', height: 200, '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <CardContent>
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial', color: 'white' }}>
              Shop
            </Typography>
            <Box sx={{ marginTop: 2 }}> {/* Adjust the top margin as needed */}
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Give away and buy food from others
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
