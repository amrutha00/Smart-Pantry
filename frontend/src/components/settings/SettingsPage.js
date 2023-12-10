import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import backgroundImage from '../../assets/settings-micro.jpg';
import {CircularProgress} from '@mui/material';

function SettingsPage() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [editedName, setEditedName] = useState('');
  const [editedTimezone, setEditedTimezone] = useState('');
  const [saveStatus, setSaveStatus] = useState({ success: false, error: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser);
      } else {
        history.push("/sign-in");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [history]);

  const fetchUserData = async (authUser) => {
    setIsLoading(true);
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API + "/user";
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      const data = await response.json();
      setUserData(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const endpoint = process.env.REACT_APP_BACKEND_API + "/timezone";
    fetch(endpoint)
      .then(response => response.json())
      .then(data => setTimezones(data.data));
  }, []);

  useEffect(() => {
    setEditedName(userData?.name || '');
    setEditedTimezone(userData?.timezone || '');
  }, [userData]);

  const handleSave = async () => {
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API + "/user/details";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ name: editedName, timezone: editedTimezone }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user details');
      }
      fetchUserData(user);
      setSaveStatus({ success: true, error: false, message: 'User details updated successfully' });
    } catch (error) {
      console.error("Error updating user data:", error);
      setSaveStatus({ success: false, error: true, message: 'Error updating user details' });
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: 'black',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress sx={{ ml:  25 }}/>
      </Box>
    );
  }

  if (!user || !userData) {
    return (
      <Box 
        sx={{ 
          bgcolor: 'black',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          pl: 25
        }}
    
      ></Box>
    )
  }


  return (
    <Box 
        sx={{ 
          bgcolor: 'black',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          pl: 25
        }}
    >
      <Card sx={{ minWidth: "100vh", ml:  25 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Settings
          </Typography>
          <TextField
            disabled
            label="Email"
            value={userData.email}
            margin="normal"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            select
            label="Timezone"
            value={editedTimezone}
            onChange={(e) => setEditedTimezone(e.target.value)}
            margin="normal"
            fullWidth
          >
            {timezones.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                Save
            </Button>
          </Box>
          {saveStatus.success && <Alert severity="success" sx={{ mt: 2 }}>{saveStatus.message}</Alert>}
          {saveStatus.error && <Alert severity="error" sx={{ mt: 2 }}>{saveStatus.message}</Alert>}

      </CardContent>
    </Card>
    </Box>
  );
}

export default SettingsPage;
