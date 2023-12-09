// Discover.js
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    Box,
    Button,
    Grid,
    Card,
    CardActionArea,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CardMedia
  } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



function Discover() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [error, setError] = useState(null);
  const [listVisible, setListVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchItems(authUser);
      } else {
        history.push("/sign-in");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [history]);

  const fetchItems = async (authUser) => {
    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/food-items";
        const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      const data = await response.json();
      setFoodItems(data.data);
    } catch (error) {
      console.error("Error fetching items data:", error);
    }
  };

  const handleBoxClick = (days) => {
    const filteredItems = foodItems.filter(item => item.NumberOfDaysToExpire <= days && item.NumberOfDaysToExpire>0);
    filteredItems.sort((a, b) => a.NumberOfDaysToExpire - b.NumberOfDaysToExpire);
    setDisplayItems(filteredItems);
    setListVisible(true); // Set the list as visible
    setCurrentSelection(days === 2 ? 'expire in 2 days' : 'expire in one week');
    setShowDeleteButton(false);
  };

  const handleExpiredBoxClick = () => {
    const expiredItems = foodItems.filter(item => item.isExpired);
    setDisplayItems(expiredItems);
    setListVisible(true);
    setCurrentSelection('expired');
    setShowDeleteButton(true); // Show the delete button
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleDeleteAllExpired = async () => {
      try {
          const endpoint = process.env.REACT_APP_BACKEND_API + "/food-items/expired";
          const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          });
          
          if (response.ok) {
            fetchItems(user);
            setListVisible(false); // Hide the list initially
            setCurrentSelection(''); // Clear the current selection
            setShowDeleteButton(false); // Hide the delete button
          } else {
            // Handle API error response
            throw new Error('Failed to delete expired items');
          }

      } catch (error) {
        console.error("Error deleting expired items", error);
      }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 10 }} bgcolor="grey">
      <Grid container spacing={2} justifyContent="center">
      <Grid item>
          <Card sx={{ width: 250, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CardActionArea onClick={handleExpiredBoxClick} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                Items already expired
              </Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 50 }} />
            </CardActionArea>
          </Card>
        </Grid>
          <Grid item>
            <Card sx={{ width: 250, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardActionArea onClick={() => handleBoxClick(2)} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial'}}>
                  Food expiring in 2 days
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 50 }} />
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ width: 250, height: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardActionArea onClick={() => handleBoxClick(7)} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                  Foods expiring in one week
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 50 }} />
              </CardActionArea>
            </Card>
          </Grid>

      </Grid>

      {listVisible && (
          <Box sx={{ mt: 4 }}>
            {showDeleteButton && (
                <Button 
                  variant="contained" 
                  color="error" 
                  sx={{ mb: 2 }}
                  onClick={handleDeleteAllExpired}
                >
                  Delete all expired items
                </Button>
            )}
            <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontFamily: 'Arial', // Example: Change to the font family you prefer
                  fontSize: '1.2rem',  // Adjust the font size as needed
                  color: 'black'        // Change to the color you want
                }}
            >
              {`${displayItems.length} items ${currentSelection}`}
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="food items table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Food Item</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>Is Expired</TableCell>
                        <TableCell align="right">Purchase Date</TableCell>
                        <TableCell align="right">Expiry Date</TableCell>
                        <TableCell align="right">Days To Expire</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {displayItems.map((item) => (
                        <TableRow key={item._id}>
                        <TableCell>
                            {item.imageUrl && (
                            <CardMedia
                                component="img"
                                style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                }}
                                image={item.imageUrl}
                                alt={item.name}
                            />
                            )}
                        </TableCell>
                        <TableCell align="center">{item.name}</TableCell>
                        <TableCell align="center">{item.isExpired ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">{new Date(item.boughtDate).toDateString()}</TableCell>
                        <TableCell align="right">{new Date(item.expiryDate).toDateString()}</TableCell>
                        <TableCell align="right">{item.NumberOfDaysToExpire}</TableCell>
                        {/* <TableCell align="right">
                            <IconButton onClick={() => deleteItem(item._id, user)}>
                            <DeleteIcon />
                            </IconButton>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton onClick={() => handleEditItem(item)}>
                                <EditIcon />
                            </IconButton>
                        </TableCell> */}
        
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
        )}
    </Box>
    
  );
}

export default Discover;
