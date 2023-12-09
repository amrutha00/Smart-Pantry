import * as React from 'react';
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { auth } from "../../firebase";
// import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';
import logoImage from '../../assets/logo5.png'; // Adjust the path as needed


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUpSide() {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(username);
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      addUser(userCredential.user, data.get('username'));
      history.push("/sign-in");
    })
    .catch((error) => {
      console.log(error);
      setError(getErrorMessage(error.code));
    });
  };

  const addUser = async (authUser, username) => {
    try {
      const endpoint = process.env.REACT_APP_BACKEND_API + "/user/";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.accessToken}`,
        },
        body: JSON.stringify({ name: username }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user details');
      }
    } catch (error) {
      console.error("Error adding user data:", error);
    }
  };

  function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Email already exists';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/weak-password':
            return 'Password is too weak';
        case 'auth/missing-password':
            return 'Password is missing'
        default:
            return 'An error occurred during sign up';
    }
}

  return (
    <ThemeProvider theme={dark}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1530554764233-e79e16c91d08?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={logoImage}
              alt="Logo"
              style={{ width: '300px', height: '100px', marginBottom: '20px'}}
            />
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: '500px', mx: 'auto' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Name"
                  name="username"
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!email || !username || !password}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                </Grid>
                <Grid item>
                    <Link
                      to="/sign-in"
                      variant="body2"
                      style={{
                        color: "white",       // Make the text white
                        fontFamily: "Arial",  // Change the font
                        fontSize: "16px",      // Change the font size
                        textDecoration: "none"
                      }}
                    >
                      {"Already have an account? Sign In"}
                    </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}