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

function SettingsPage() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [editedName, setEditedName] = useState('');
  const [editedTimezone, setEditedTimezone] = useState('');
  const [saveStatus, setSaveStatus] = useState({ success: false, error: false, message: '' });


  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
        fetchUserData(authUser);
      } else {
        // No user is signed in, redirect to sign-in page
        history.push("/sign-in");
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, [history]);

  // Fetch user data using the provided access token
  const fetchUserData = async (authUser) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Fetch the timezones
    fetch("http://localhost:3000/api/timezone")
      .then(response => response.json())
      .then(data => setTimezones(data.data));
  }, []);

  useEffect(() => {
    setEditedName(userData?.name || '');
    setEditedTimezone(userData?.timezone || '');
  }, [userData]);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/details", {
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
      // Fetch updated user data
      fetchUserData(user);
      setSaveStatus({ success: true, error: false, message: 'User details updated successfully' });
    } catch (error) {
      console.error("Error updating user data:", error);
      setSaveStatus({ success: false, error: true, message: 'Error updating user details' });
    }
  };

  if (!user || !userData) {
    return null; // Render nothing until user is authenticated and user data is fetched
  }

  return (
    <Box bgcolor="black" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ minWidth: "100vh" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Settings
          </Typography>
          <TextField
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
