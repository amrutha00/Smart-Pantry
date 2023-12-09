import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    Box,
    Button,
    Grid,
    Card,
    CardContent,
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
import { styled } from '@mui/material/styles';

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& th': {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },

}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  background: theme.palette.background.default

}));

const defaultRecipes = [
  {
      "id": 73420,
      "image": "https://spoonacular.com/recipeImages/73420-312x231.jpg",
      "imageType": "jpg",
      "likes": 0,
      "missedIngredientCount": 3,
      "missedIngredients": [
          {
              "aisle": "Baking",
              "amount": 1.0,
              "id": 18371,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg",
              "meta": [],
              "name": "baking powder",
              "original": "1 tsp baking powder",
              "originalName": "baking powder",
              "unit": "tsp",
              "unitLong": "teaspoon",
              "unitShort": "tsp"
          },
          {
              "aisle": "Spices and Seasonings",
              "amount": 1.0,
              "id": 2010,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/cinnamon.jpg",
              "meta": [],
              "name": "cinnamon",
              "original": "1 tsp cinnamon",
              "originalName": "cinnamon",
              "unit": "tsp",
              "unitLong": "teaspoon",
              "unitShort": "tsp"
          },
          {
              "aisle": "Milk, Eggs, Other Dairy",
              "amount": 1.0,
              "id": 1123,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/egg.png",
              "meta": [],
              "name": "egg",
              "original": "1 egg",
              "originalName": "egg",
              "unit": "",
              "unitLong": "",
              "unitShort": ""
          }
      ],
      "title": "Apple Or Peach Strudel",
      "unusedIngredients": [],
      "usedIngredientCount": 1,
      "usedIngredients": [
          {
              "aisle": "Produce",
              "amount": 6.0,
              "id": 9003,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg",
              "meta": [],
              "name": "apples",
              "original": "6 large baking apples",
              "originalName": "baking apples",
              "unit": "large",
              "unitLong": "larges",
              "unitShort": "large"
          }
      ]
  },
  {
      "id": 632660,
      "image": "https://spoonacular.com/recipeImages/632660-312x231.jpg",
      "imageType": "jpg",
      "likes": 3,
      "missedIngredientCount": 4,
      "missedIngredients": [
          {
              "aisle": "Milk, Eggs, Other Dairy",
              "amount": 1.5,
              "extendedName": "unsalted butter",
              "id": 1001,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/butter-sliced.jpg",
              "meta": [
                  "unsalted",
                  "cold"
              ],
              "name": "butter",
              "original": "1 1/2 sticks cold unsalted butter cold unsalted butter<",
              "originalName": "cold unsalted butter cold unsalted butter<",
              "unit": "sticks",
              "unitLong": "sticks",
              "unitShort": "sticks"
          },
          {
              "aisle": "Produce",
              "amount": 4.0,
              "id": 1079003,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/red-delicious-apples.png",
              "meta": [
                  "red",
                  " such as golden delicious, peeled, cored and cut into 1/4-inch-thick slices "
              ],
              "name": "red apples",
              "original": "4 larges red apples, such as Golden Delicious, peeled, cored and cut into 1/4-inch-thick slices",
              "originalName": "s red apples, such as Golden Delicious, peeled, cored and cut into 1/4-inch-thick slices",
              "unit": "large",
              "unitLong": "larges",
              "unitShort": "large"
          },
          {
              "aisle": "Spices and Seasonings",
              "amount": 2.0,
              "id": 2010,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/cinnamon.jpg",
              "meta": [],
              "name": "cinnamon",
              "original": "2 teaspoons cinnamon",
              "originalName": "cinnamon",
              "unit": "teaspoons",
              "unitLong": "teaspoons",
              "unitShort": "tsp"
          },
          {
              "aisle": "Nut butters, Jams, and Honey",
              "amount": 2.0,
              "id": 19719,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/apricot-jam.jpg",
              "meta": [
                  "melted"
              ],
              "name": "apricot preserves",
              "original": "2 tablespoons apricot preserves, melted and strained",
              "originalName": "apricot preserves, melted and strained",
              "unit": "tablespoons",
              "unitLong": "tablespoons",
              "unitShort": "Tbsp"
          }
      ],
      "title": "Apricot Glazed Apple Tart",
      "unusedIngredients": [
          {
              "aisle": "Produce",
              "amount": 1.0,
              "id": 9003,
              "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg",
              "meta": [],
              "name": "apples",
              "original": "apples",
              "originalName": "apples",
              "unit": "serving",
              "unitLong": "serving",
              "unitShort": "serving"
          }
      ],
      "usedIngredientCount": 0,
      "usedIngredients": []
  }
];

function Discover() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [error, setError] = useState(null);
  const [listVisible, setListVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [recipes, setRecipes] = useState(defaultRecipes);
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
    setListVisible(true);
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
      
      if(!response.ok) {
        setShowRecipes(true);
        setListVisible(false);
        setShowDeleteButton(false);
        return;
      }
      console.log(response);
      console.log("here");
      console.log(data);
      console.log("here2");
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
                Food already Expired
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
                Food expiring in next One Week
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
        <StyledPaper style={{ margin: 10, padding: 20 }}>
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
                  <StyledTableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Expired?</TableCell>
                      <TableCell >Purchase Date</TableCell>
                      <TableCell>
                        Expiry Date
                      </TableCell>
                      <TableCell >Expires In (days)</TableCell>
                      <TableCell >Qty</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {displayItems
                    .map((item) => (
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
                        <TableCell >{item.name}</TableCell>
                        <TableCell >{item.isExpired ? 'Yes' : 'No'}</TableCell>
                        <TableCell >{new Date(item.boughtDate).toDateString()}</TableCell>
                        <TableCell >{new Date(item.expiryDate).toDateString()}</TableCell>
                        <TableCell align="center">{item.NumberOfDaysToExpire}</TableCell>
                        <TableCell >{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </TableContainer>
            </Box>
        </StyledPaper>
          
      )}

      {showRecipes && (
        <>
          {recipes.length === 0 ? (
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
              There are No Recipes available. Add more food items to discover recipes or try again later.
            </Typography>
          ) : (
            <StyledPaper style={{ margin: 10, padding: 20 }}>
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
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                          cursor: 'pointer',
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
            </StyledPaper>
          )}
        </>
      )}

     <RecipeDialog />
    </Box>
    
  );
}

export default Discover;
