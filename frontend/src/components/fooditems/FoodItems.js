import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider,  DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import backgroundImage from '../../assets/fooditems.jpg';

const StyledPaper = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    background: theme.palette.background.default,
  
}));
  
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& th': {
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
      fontSize: '1.1rem',
    },
  
}));
  
const StyledAddButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
}));
  
const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      paddingRight: 0,
    },
}));
  
const ActionButton = styled(IconButton)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
}));

const StyledDeleteIcon = styled(DeleteIcon)({
    color: '#ff6666',
});

function FoodItems() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [expiryerror, setexpiryError] = useState(false);
  const [expiryerror2, setexpiryError2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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
      setItems(data.data);
    } catch (error) {
      console.error("Error fetching items data:", error);
    }
  };

  // State for the add item dialog
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    boughtDate: null,
    expiryDate: null,
  });
  
  // State for the edit item dialog
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...newItem });

  const handleOpenAddItemDialog = () => {
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  const handleAddItem = async () => {
    addItems(user);
   
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  
  const handleSortByExpiryDate = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    const sortedItems = [...items].sort((a, b) => {
      const dateA = new Date(a.expiryDate);
      const dateB = new Date(b.expiryDate);
      return sortDirection === "asc" ? dateB - dateA : dateA - dateB;
    });
    setItems(sortedItems);
  };
  

  const addItems = async (authUser) => {
    const currentDate = new Date();
    const expiryDate = new Date(newItem.expiryDate);
    const boughtDate = new Date(newItem.boughtDate);
    // Check if the expiryDate is greater than or equal to the current date
    if (expiryDate.getTime() < currentDate.getTime()) {
    setexpiryError(true);
    console.log("set expiry error");
      return; // Exit the function without making the API call
    }

    if (expiryDate.getTime() <= boughtDate.getTime()) {
        setexpiryError2(true);
        console.log("set expiry error2");
          return; // Exit the function without making the API call
        }

    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/food-items";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.accessToken}`
        },
        body: JSON.stringify(newItem)
      });
      if (!response.ok) {
        throw new Error('Failed to add new item');
      }
      fetchItems(authUser);
      handleCloseAddItemDialog();
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const deleteItem = async (itemId, authUser) => {
    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/food-items/";
      const response = await fetch(`${endpoint}${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      fetchItems(authUser);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = (itemToEdit) => {
    setEditedItem({ ...itemToEdit });
    setOpenEditItemDialog(true);
  };
  
  const handleCloseEditItemDialog = () => {
    setOpenEditItemDialog(false);
  };
  
  const handleUpdateItem = async () => {
    updateItem(user);
  };
  
  const updateItem = async (authUser) => {
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API + `/food-items/${editedItem._id}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.accessToken}`,
        },
        body: JSON.stringify(editedItem),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
  
      fetchItems(authUser);
      handleCloseEditItemDialog();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

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
            } else {
            // Handle API error response
            throw new Error('Failed to delete expired items');
            }

        } catch (error) {
        console.error("Error deleting expired items", error);
        }
    };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (items.length === 0) {
    return <Typography>No food items found.</Typography>;
  }

  return (
    <Box 
      sx={{ 
        pt: 8, 
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'top'
      }} 
    >

      <StyledPaper style={{ margin: 20, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SearchField
              id="search-food"
              label="Search for food"
              variant="outlined"
              style={{ margin: 10 }}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <Button position="end">
                    <SearchIcon />
                  </Button>
                ),
              }}
            />

            <div>
              <StyledAddButton 
                variant="contained" 
                sx={{ 
                  backgroundColor: 'green',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  }
                }}
                onClick={handleOpenAddItemDialog}
              >
                Add Item
              </StyledAddButton>

              <StyledAddButton 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        },
                        margin: 2
                      }}
                      onClick={handleDeleteAllExpired}
                    >
                      Delete all expired items
              </StyledAddButton>
            </div>
        </div>
        
        <TableContainer component={Paper}>
          <Table aria-label="food items table">
            <StyledTableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Expired?</TableCell>
                <TableCell >Purchase Date</TableCell>
                <TableCell onClick={handleSortByExpiryDate} style={{ cursor: 'pointer' }}>
                  Expiry Date
                  {sortDirection === "asc" ? <ArrowDownwardIcon sx={{ fontSize: 20, color: 'white' }}/> : <ArrowUpwardIcon />}
                </TableCell>
                <TableCell >Expires In (days)</TableCell>
                <TableCell >Qty</TableCell>
                <TableCell ></TableCell>
                <TableCell ></TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {items.filter((item) => item.name.toLowerCase().includes(searchTerm))
              .sort((a, b) => {
                const dateA = new Date(a.expiryDate);
                const dateB = new Date(b.expiryDate);
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
              })
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
                  <TableCell >
                    <ActionButton onClick={() => deleteItem(item._id, user)}>
                      <StyledDeleteIcon />
                    </ActionButton>
                  </TableCell>
                  <TableCell >
                    <ActionButton onClick={() => handleEditItem(item)}>
                        <EditIcon />
                    </ActionButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Item Dialog */}
        <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
          <DialogTitle>Add New Food Item</DialogTitle>
          <DialogContent>
            <SearchField
              label="Name"
              fullWidth
              margin="normal"
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <SearchField
              label="Quantity"
              fullWidth
              margin="normal"
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            
      <DatePicker
        label="Purchase Date"
        value={newItem.boughtDate}
        onChange={(date) => setNewItem({ ...newItem, boughtDate: date })}
        renderInput={(params) => <TextField {...params} margin="normal" />}
      />
      
      <DatePicker
        label="Expiry Date"
        value={newItem.expiryDate}
        onChange={(date) => {
            setNewItem({ ...newItem, expiryDate: date });
            setexpiryError(false); // Set expiryError to false
            setexpiryError2(false); // Set expiryError2 to false
          }}
        renderInput={(params) => <TextField {...params} margin="normal" />}
      />
    </LocalizationProvider>
    {expiryerror && <Alert severity="error">Item Already Expired</Alert>}
    {expiryerror2 && <Alert severity="error"> Expiry Date should be later than Bought Date</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddItemDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddItem} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for edit */}
        <Dialog open={openEditItemDialog} onClose={handleCloseEditItemDialog}>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            />
            <TextField
              label="Quantity"
              fullWidth
              margin="normal"
              value={editedItem.quantity}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Purchase Date"
                onChange={(date) => setEditedItem({ ...editedItem, boughtDate: date })}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
              <DatePicker
                label="Expiry Date"
                onChange={(date) => setEditedItem({ ...editedItem, expiryDate: date })}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>
            {expiryerror && <Alert severity="error">Item Already Expired</Alert>}
            {expiryerror2 && <Alert severity="error"> Expiry Date should be later than Bought Date</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditItemDialog}>Cancel</Button>
            <Button onClick={handleUpdateItem} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </StyledPaper>

    </Box>
  );
}

export default FoodItems;
