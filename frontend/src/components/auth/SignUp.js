import './SignUp.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { auth } from "../../firebase";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";

function SignUp() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
  
    const signUp = (e) => {
      setError(false);
      e.preventDefault();
      let eml = document.getElementById('create-email').value;
      let pass = document.getElementById('create-password').value;
      setEmail(eml);
      setPassword(pass);
      createUserWithEmailAndPassword(auth, eml, pass)
        .then((userCredential) => {
          console.log(userCredential);
          history.push("/sign-in");
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        }));

  return (
    <>
        <div className="sign-in-container">
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
        </Grid>
        <Grid item xs={6}>
          <Item>
            
                <form onSubmit={signUp}>
                    {error && <Alert severity="error">Invalid Password</Alert>}
                    <h1>Create Account</h1>
                    <hr />
                    <div className='email'>
                        <TextField id="create-email" type='email' size="medium" label="Email" required variant="outlined" />
                    </div>
                    
                    <br />
                    <div className='password'>
                        <TextField id="create-password" minLength={6} type="password" label="Password" required variant="outlined" />
                    </div>
                    
                    <br />
                    {/* <button type="submit">Log In</button> */}
                    <Button className="sign-in" type="submit" variant="contained">Create Account</Button>
                    &nbsp;&nbsp;
                    <br /><br />
                    <Button type="button" color="warning" variant="contained"><Link to='/sign-in'>Login</Link></Button>
                    <br />
                </form>
          </Item>
        </Grid>
        <Grid item xs>
        </Grid>
      </Grid>
    </Box>
    </div>



        {/* <div className="sign-in-container">
        <form onSubmit={signUp}>
            <h1>Create Account</h1>
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Sign Up</button>
        </form>
        </div> */}
    </>
  );
}

export default SignUp;
