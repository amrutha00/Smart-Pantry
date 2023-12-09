// Discover.js
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    Box,
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
    const filteredItems = foodItems.filter(item => item.NumberOfDaysToExpire <= days);
    filteredItems.sort((a, b) => a.NumberOfDaysToExpire - b.NumberOfDaysToExpire);
    setDisplayItems(filteredItems);
    setListVisible(true); // Set the list as visible
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 10 }} bgcolor="grey">
      <Grid container spacing={2} justifyContent="center">
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
