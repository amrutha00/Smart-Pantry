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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { get } from '../apiService';
import { post } from '../apiService';

function FoodItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the add item dialog
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    purchaseDate: null, // Initialize with null or a default date
    expiryDate: null,   // Initialize with null or a default date
  });
  

  const handleOpenAddItemDialog = () => {
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  const handleAddItem = async () => {
    try {
      // Perform the POST request to add the new item
      await post('/api/food-items', newItem);

      // Refresh the list of items
      const response = await get('/api/food-items');
      if (Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setError('Invalid API response format.');
      }

      // Close the dialog
      handleCloseAddItemDialog();
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Error adding item.');
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await get('/api/food-items');
        console.log('API Response:', response); // Log the API response
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          setError('Invalid API response format.');
        }
      } catch (err) {
        console.error('API Request Error:', err); // Log the error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (items.length === 0) {
    return <Typography>No food items found.</Typography>;
  }

  return (
    <Paper style={{ margin: 20, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          id="search-food"
          label="Search for food"
          variant="outlined"
          style={{ marginBottom: 20 }}
          InputProps={{
            endAdornment: (
              <Button position="end">
                <SearchIcon />
              </Button>
            ),
          }}
        />
        <Button variant="outlined" color="primary" onClick={handleOpenAddItemDialog}>
          Add Item
        </Button>
      </div>
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
            </TableRow>
          </TableHead>
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
                <TableCell align="right">{item.boughtDate}</TableCell>
                <TableCell align="right">{item.expiryDate}</TableCell>
                <TableCell align="right">{item.NumberOfDaysToExpire}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Item Dialog */}
      <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
        <DialogTitle>Add New Food Item</DialogTitle>
        <DialogContent>
          <TextField
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
    </Paper>
  );
}

export default FoodItems;
