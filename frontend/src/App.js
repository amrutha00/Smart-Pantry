import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/home/header/Header';
import {getAuth} from "firebase/auth";

function App() {
  let user = getAuth().currentUser;
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <>
    <ThemeProvider theme={darkTheme}>
    
    
    <Router basename='/'>
      <Switch>
        <Route exact path='/sign-in'>
          <SignIn></SignIn>
        </Route>
        <Route exact path='/sign-up'>
          <SignUp></SignUp>
        </Route>
        <Route exact path='/home'>
          {getAuth().currentUser && <Header></Header>}
          <Home></Home>
          {/* <AuthDetails></AuthDetails> */}
        </Route>

        <Route exact path='*'>
          <SignIn></SignIn>
        </Route>
      </Switch>
      
      
    </Router>
    </ThemeProvider>
    </>
  );
}

export default App;
