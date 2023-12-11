import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  CircularProgress,
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
import dayjs from 'dayjs';



const StyledPaper = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    background: theme.palette.background.default
  
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

function LeftOvers() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [expiryerror, setexpiryError] = useState(false);
  const [expiryerror2, setexpiryError2] = useState(false);
  const [expiryerror3, setexpiryError3] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


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
    setIsLoading(true);
    setItems([]);
    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/left-overs";
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authUser.accessToken}`,
          },
        });
        const data = await response.json();
        setItems(data.data);
        setIsLoading(false);
    } catch (error) {
        console.error("Error fetching items data:", error);
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  // State for the add item dialog
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
   quantity: '',
    expiryDate: null,
  });
  
  // State for the edit item dialog
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [editedItem, setEditedItem] = useState({
    name: '',
   quantity: '',
    
    expiryDate: null,
  });

  const handleOpenAddItemDialog = () => {
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
    setexpiryError(false);
    setexpiryError2(false);
    setexpiryError3(false);
    setNewItem({
      name: '',
     quantity: '',
      postedDate: null,
      expiryDate: null,
    })
  };

  const handleAddItem = async () => {
    addItems(user);
  };

  const addItems = async (authUser) => {
    setIsAdding(true);
    try {
      const { name, quantity, postedDate, expiryDate } = newItem;

      if (!name || !quantity || !expiryDate) {
        console.log("New item fields are empty");
        setexpiryError2(true);
        return;
      }
      else {
        setexpiryError2(false);
      }

      const currentDate = new Date();
      const expiry = new Date(expiryDate);
      //const bought = new Date(boughtDate);
      // Check if the expiryDate is greater than or equal to the current date
      if (expiry.getTime() < currentDate.getTime()) {
          setexpiryError(true);
          console.log("Item already expired error");
          return;
      }
      const num_quantity = parseInt(quantity);
      if (!isNaN(num_quantity) && num_quantity <= 0)
      {
         setexpiryError3(true);
          console.log("Quantity must be greater than 0");
          return;
      }

    //   if (expiry.getTime() <= bought.getTime()) {
    //       setexpiryError2(true);
    //       console.log("Expiry date is before purchase date error");
    //       return; 
    //   }

      const endpoint = process.env.REACT_APP_BACKEND_API + "/left-overs";
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
      setIsAdding(false);
      handleCloseAddItemDialog();
      fetchItems(authUser);
    } catch (error) {
      console.error("Error adding new item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCloseEditItemDialog = () => {
    setOpenEditItemDialog(false);
    setexpiryError(false);
    setexpiryError2(false);
    setexpiryError3(false);
    setEditedItem({
      name: '',
     quantity: '',
      expiryDate: null,
    })
  };

  const handleEditItem = (itemToEdit) => {
    const editedItemWithDayjs = {
      ...itemToEdit,
      //boughtDate: itemToEdit.boughtDate ? dayjs(itemToEdit.boughtDate) : null,
      expiryDate: itemToEdit.expiryDate ? dayjs(itemToEdit.expiryDate) : null,
    };
    setEditedItem(editedItemWithDayjs);
    setOpenEditItemDialog(true);
  };

  const handleUpdateItem = async () => {
    updateItem(user);
  };

  const updateItem = async (authUser) => {
    setIsEditing(true);
    try {
      const { name, quantity, expiryDate } = editedItem;
      console.log(JSON.stringify(editedItem));
    //   if (!name || !quantity || !boughtDate || !expiryDate) {
    //     console.log("Fields are empty");
    //     setexpiryError3(true);
    //     return;
    //   }
    //   else {
    //     setexpiryError3(false);
    //   }
      
      const currentDate = new Date();
      const expiry = new Date(expiryDate);
      //const bought = new Date(boughtDate);
      // Check if the expiryDate is greater than or equal to the current date
      if (expiry.getTime() < currentDate.getTime()) {
          setexpiryError(true);
          console.log("Item already expired error");
          return;
      }
      const num_quantity = parseInt(quantity);
      if (!isNaN(num_quantity) && num_quantity <= 0)
      {
         setexpiryError3(true);
          console.log("Quantity must be greater than 0");
          return;
      }

  
      const endpoint = process.env.REACT_APP_BACKEND_API + `/left-overs/${editedItem._id}`;
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
      setIsEditing(false);
      handleCloseEditItemDialog();
      fetchItems(authUser);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsEditing(false);
    }
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


  const deleteItem = async (itemId, authUser) => {
    try {
        const endpoint = process.env.REACT_APP_BACKEND_API + "/left-overs/";
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

  
  const handleDeleteAllExpired = async () => {
    try {
            const endpoint = process.env.REACT_APP_BACKEND_API + "/left-over/expired";
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

  return (
    <Box 
      bgcolor="grey"
      sx={{ 
        pt: 8, 
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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
                <TableCell>Posted Date</TableCell>
                <TableCell onClick={handleSortByExpiryDate} style={{ cursor: 'pointer' }}>
                  Expiry Date
                  {sortDirection === "asc" ? <ArrowDownwardIcon sx={{ fontSize: 20, color: 'white' }}/> : <ArrowUpwardIcon />}
                </TableCell>
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
                  <TableCell >{new Date(item.postedDate).toDateString()}</TableCell>
                  <TableCell >{new Date(item.expiryDate).toDateString()}</TableCell>
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

        {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>)}

        {/* Add Item Dialog */}
        <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
          <DialogTitle>Add New Food Item</DialogTitle>
          <DialogContent>
            <SearchField
              label="Name"
              fullWidth
              margin="normal"
              onChange={(e) => {
                setNewItem({ ...newItem, name: e.target.value });
                /*setexpiryError3(false);*/
              }}
            />
            <SearchField
              label="Quantity"
              fullWidth
              margin="normal"
              onChange={(e) => {
                setNewItem({ ...newItem, quantity: e.target.value })
                /*setexpiryError3(false);*/
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              
                
                <DatePicker
                  label="Expiry Date"
                  onChange={(date) => {
                      setNewItem({ ...newItem, expiryDate: date });
                      setexpiryError(false);
                      setexpiryError2(false);
                      /*setexpiryError3(false);*/
                    }}
                  renderInput={(params) => <TextField {...params} margin="normal" />}
                />
            </LocalizationProvider>

            {isAdding && 
              <Box sx={{ position: 'relative' , margin: 5}}>
                <CircularProgress size={24} sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    marginTop: '-12px', 
                    marginLeft: '-12px' 
                }} />
              </Box>
            }

            {expiryerror && <Alert severity="error">Item Already Expired</Alert>}
            {expiryerror2 && <Alert severity="error"> Expiry Date should be later than Bought Date</Alert>}
            {expiryerror3 && <Alert severity="error"> Quantity must be greater than 0</Alert>}

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
              onChange={(e) => {
                /*setexpiryError3(false);*/
                setEditedItem({ ...editedItem, name: e.target.value })
              }}
            />
            <TextField
              label="Quantity"
              fullWidth
              margin="normal"
              value={editedItem.quantity}
              onChange={(e) => {
                /*setexpiryError3(false);*/
                setEditedItem({ ...editedItem, quantity: e.target.value })
                }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            
              <DatePicker
                label="Expiry Date"
                value={editedItem.expiryDate}
                onChange={(date) => {
                  setexpiryError(false);
                  setexpiryError2(false);
                  /*setexpiryError3(false);*/
                  setEditedItem({ ...editedItem, expiryDate: date })
                }}
                renderInput={(params) => <TextField {...params} margin="normal" />}
              />
            </LocalizationProvider>

            {isEditing && 
              <Box sx={{ position: 'relative' , margin: 5}}>
                <CircularProgress size={24} sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    marginTop: '-12px', 
                    marginLeft: '-12px' 
                }} />
              </Box>
            }

            {expiryerror && <Alert severity="error">Item Already Expired. Delete the item.</Alert>}
            {expiryerror2 && <Alert severity="error"> Enter all the details to add</Alert>}
            {expiryerror3 && <Alert severity="error"> Quantity must be greater than 0</Alert>}

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

export default LeftOvers;
