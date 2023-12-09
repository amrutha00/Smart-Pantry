import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    Box,
    Button,
    Grid,
    Card,
    CardContent,
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
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import backgroundImg from '../../assets/discover.jpg';


function Discover() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [error, setError] = useState(null);
  const [listVisible, setListVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeTitle, setRecipeTitle] = useState("Recipe Details");
  const [openRecipeDialog, setOpenRecipeDialog] = useState(false);


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
    setShowRecipes(false);
  };

  const handleExpiredBoxClick = () => {
    const expiredItems = foodItems.filter(item => item.isExpired);
    setDisplayItems(expiredItems);
    setListVisible(true);
    setCurrentSelection('expired');
    setShowDeleteButton(true); // Show the delete button
    setShowRecipes(false);
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
            setShowRecipes(false);
          } else {
            // Handle API error response
            setShowRecipes(false);
            throw new Error('Failed to delete expired items');
            
          }

      } catch (error) {
        setShowRecipes(false);
        console.error("Error deleting expired items", error);
      }
  };

  const fetchRecipes = async () => {
    try {
      // Filter out expired items and extract the names
      const validIngredients = foodItems
        .filter(item => !item.isExpired)
        .map(item => item.name);
  
      // Join the names into a string for the API query
      const ingredientsQuery = validIngredients.join(",+");
  
      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsQuery}&apiKey=a4a6dbafa80448fdba702620b1258d93`;
      const response = await fetch(url);
      const data = await response.json();
  
      setRecipes(data);
      setShowRecipes(true);
      setListVisible(false); // Hide other lists
      setShowDeleteButton(false); // Hide delete button
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleRecipeClick = async (recipeId, recipeTitle) => {
    try {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=a4a6dbafa80448fdba702620b1258d93`;
      const response = await fetch(url);
      const data = await response.json();
  
      setRecipeTitle(recipeTitle);
      setRecipeDetails(data);
      setOpenRecipeDialog(true);
      setListVisible(false);
      setShowDeleteButton(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const RecipeDialog = () => (
    
    <Dialog open={openRecipeDialog} onClose={() => setOpenRecipeDialog(false)} maxWidth="md">
      <DialogTitle>
        {recipeTitle}
      </DialogTitle>
      <DialogContent>
        {recipeDetails && recipeDetails.length > 0 ? (
          recipeDetails.map((section, index) => (
            <div key={index}>
              {section.name && (
                <Typography variant="h6" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                  {section.name}
                </Typography>
              )}
              {section.steps.map((step, stepIndex) => (
                <Typography key={stepIndex} style={{ marginTop: '10px' }}>
                  <strong>Step {step.number}:</strong> {step.step}
                </Typography>
              ))}
            </div>
          ))
        ) : (
          <Typography>Recipe Instructions not available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenRecipeDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
  
  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        p: 10, 
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',     // Cover the entire space of the box
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh'           // Ensure it covers the whole viewport height
      }} 
      bgcolor="grey"
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
    <Card 
      sx={{ 
        width: 250, 
        height: 250, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align items to the start
        backgroundColor: 'black',
        position: 'relative', // Parent should be relative for absolute positioning of the child
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken on hover
          transform: 'scale(1.05)',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }
      }}
      onClick={handleExpiredBoxClick}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: 'white', textAlign: 'left' }}>
          Food already expired
        </Typography>
      </CardContent>
      <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: 'white' }} />
      </Box>
    </Card>
        </Grid>

        <Grid item>
  <Card 
    sx={{ 
      width: 250, 
      height: 250, 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-start', // Align items to the start
      backgroundColor: 'black',
      position: 'relative', // Parent should be relative for absolute positioning of the child
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken on hover
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }
    }}
    onClick={() => handleBoxClick(2)}
  >
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: 'white', textAlign: 'left' }}>
        Food expiring in next Two Days      
      </Typography>
    </CardContent>
    <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
      <KeyboardArrowDownIcon sx={{ fontSize: 50, color: 'white' }} />
    </Box>
  </Card>
        </Grid>

        <Grid item>
  <Card 
    sx={{ 
      width: 250, 
      height: 250, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start', // Align items to the start
      backgroundColor: 'black',
      position: 'relative', // Enable absolute positioning for children
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken on hover
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }
    }}
    onClick={() => handleBoxClick(7)}
  >
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: 'white', textAlign: 'left' }}>
        Food expiring in next one week
      </Typography>
    </CardContent>
    <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
      <KeyboardArrowDownIcon sx={{ fontSize: 50, color: 'white' }} />
    </Box>
  </Card>
        </Grid>

        <Grid item>
  <Card 
    sx={{ 
      width: 250, 
      height: 250, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start', // Align items to the start
      backgroundColor: 'black',
      position: 'relative', // Enable absolute positioning for children
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darken on hover
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        cursor: 'pointer',
      }
    }}
    onClick={fetchRecipes}
  >
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'left', fontWeight: 'bold', fontFamily: 'Arial', color: 'white' }}>
        Discover Recipes
      </Typography>
    </CardContent>
    <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
      <KeyboardArrowDownIcon sx={{ fontSize: 50, color: 'white' }} />
    </Box>
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
                  color: 'white'        // Change to the color you want
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

        {showRecipes && (
          <>
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 4, 
                mb: 2, 
                textAlign: 'center',
                fontWeight: 'bold',
                fontFamily: 'Arial',
                color: 'white' 
              }}
            >
              These are the recipes you can cook with the food expiring in one week
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <Card 
                    sx={{
                      '&:hover': {
                        transform: 'scale(1.05)', // Slightly increase the size of the card on hover
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Add a shadow effect on hover
                        cursor: 'pointer', // Change the cursor to indicate clickable
                      }
                    }}
                    onClick={() => handleRecipeClick(recipe.id, recipe.title)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={recipe.image}
                      alt={recipe.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {recipe.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
     <RecipeDialog />
    </Box>
    
  );
}

export default Discover;
