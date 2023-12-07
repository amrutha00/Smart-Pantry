import './SignIn.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router-dom";

function SignIn() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const signIn = (e) => {
        setError(false);
        e.preventDefault();
        let eml = document.getElementById('email').value;
        let pass = document.getElementById('password').value;
        setEmail(eml);
        setPassword(pass);
        signInWithEmailAndPassword(auth, eml, pass)
            .then((userCredential) => {
                //console.log(userCredential);
                history.push("/home");
            })
            .catch((error) => {
                //console.log(error);
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
            
                <form onSubmit={signIn}>
                    {error && <Alert severity="error">Invalid Credentials</Alert>}
                    <h1>Log In to your Account</h1>
                    <hr />
                    {/* <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ></input> */}
                    <div className='email'>
                        <TextField id="email" type='email' size="medium" label="Email" required variant="outlined" />
                    </div>
                    
                    <br />
                    {/* <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></input> */}
                    <div className='password'>
                        <TextField id="password" type="password" label="Password" required variant="outlined" />
                    </div>
                    
                    <br />
                    {/* <button type="submit">Log In</button> */}
                    <Button className="sign-in" type="submit" variant="contained">Login</Button>
                    &nbsp;&nbsp;
                    <br /><br />
                    <Button type="button" color="warning" variant="contained"><Link to='/sign-up'>Create Account</Link></Button>
                    <br />
                </form>
          </Item>
        </Grid>
        <Grid item xs>
        </Grid>
      </Grid>
    </Box>
    </div>
        
    </>
  );
}

export default SignIn;
