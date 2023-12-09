import * as React from 'react';
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { auth } from "../../firebase";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';
import logoImage from '../../assets/logo5.png';
import homeImage from '../../assets/home-micro.jpg';
import settingsImage from '../../assets/settings-micro.jpg';
import discoverImage from '../../assets/discover.jpg';
import foodItemsImage from '../../assets/fooditems.jpg';

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

export default function SignInSide() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    preloadImages(logoImage, homeImage, settingsImage, discoverImage, foodItemsImage); 
  }, []);

  const preloadImages = (...images) => {
      images.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });

    setEmail(data.get('email'),);
    setPassword(data.get('password'));
    signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
        .then((userCredential) => {
            // console.log(userCredential);
            history.push("/home");
        })
        .catch((error) => {
            console.log(error);
            setError(true);
        });
    
  };

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
            backgroundImage: 'url(https://images.unsplash.com/photo-1615220204129-3904c1f0ef96?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
              Sign In
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
              />
              {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>Invalid Credentials</Alert>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                </Grid>
                <Grid item>
                    <Link
                      to="/sign-up"
                      variant="body2"
                      style={{
                        color: "white",       // Make the text white
                        fontFamily: "Arial",  // Change the font
                        fontSize: "16px",      // Change the font size
                        textDecoration: "none"
                      }}
                    >
                      {"Don't have an account? Sign Up"}
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