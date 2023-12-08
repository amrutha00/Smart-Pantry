import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
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

const StyledPaper = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    background: theme.palette.background.default,
  }));
  
  const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.text.disabled,
    '& th': {
      color: theme.palette.primary.contrastText,
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

function FoodItems() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

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

  // State for the add item dialog
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  

  const [newItem, setNewItem] = useState({
    name: '',
    boughtDate: null, // Initialize with null or a default date
    expiryDate: null,   // Initialize with null or a default date
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

  const addItems = async (authUser) => {
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

  //for update items

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

  
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (items.length === 0) {
    return <Typography>No food items found.</Typography>;
  }

  return (
    <Box sx={{ pt: 8 }} bgcolor="grey">
      <StyledPaper style={{ margin: 20, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchField
            id="search-food"
            label="Search for food"
            variant="outlined"
            style={{ margin: 20 }}
            InputProps={{
              endAdornment: (
                <Button position="end">
                  <SearchIcon />
                </Button>
              ),
            }}
          />
          
          <StyledAddButton variant="contained" style={{ margin: 20 }} color="primary" onClick={handleOpenAddItemDialog}>
            Add Item
          </StyledAddButton>
          </div>
        <TableContainer component={Paper}>
          <Table aria-label="food items table">
            <StyledTableHead>
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
            </StyledTableHead>
            <TableBody>
              {items.map((item) => (
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
                  <TableCell align="right">
                    <ActionButton onClick={() => deleteItem(item._id, user)}>
                      <DeleteIcon />
                    </ActionButton>
                  </TableCell>
                  <TableCell align="right">
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
        onChange={(date) => setNewItem({ ...newItem, expiryDate: date })}
        renderInput={(params) => <TextField {...params} margin="normal" />}
      />
    </LocalizationProvider>
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
