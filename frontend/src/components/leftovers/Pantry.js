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

function Pantry() {
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
        const endpoint = process.env.REACT_APP_BACKEND_API + "/left-overs/all";
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authUser.accessToken}`,
          },
        });
        const data = await response.json();
        console.log(data.data);
        setItems(data.data);
        setIsLoading(false);
    } catch (error) {
        console.error("Error fetching items data:", error);
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
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

        </div>
        
        <TableContainer component={Paper}>
          <Table aria-label="food items table">
            <StyledTableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Expired?</TableCell>
                <TableCell >Posted Date</TableCell>
                <TableCell onClick={handleSortByExpiryDate} style={{ cursor: 'pointer' }}>
                  Expiry Date
                  {sortDirection === "asc" ? <ArrowDownwardIcon sx={{ fontSize: 20, color: 'white' }}/> : <ArrowUpwardIcon />}
                </TableCell>
                <TableCell >Expires In (days)</TableCell>
                <TableCell >Qty</TableCell>
                <TableCell >Contact Email</TableCell>
                {/* <TableCell ></TableCell>
                <TableCell ></TableCell> */}
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
                  <TableCell >{new Date(item.postedDate).toDateString()}</TableCell>
                  <TableCell >{new Date(item.expiryDate).toDateString()}</TableCell>
                  <TableCell align="center">{item.NumberOfDaysToExpire}</TableCell>
                  <TableCell >{item.quantity}</TableCell>
                  <TableCell >{item.contact}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>)}

      </StyledPaper>

    </Box>
  );
}

export default Pantry;
