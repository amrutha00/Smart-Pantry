import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/home/header/Header';
import {getAuth} from "firebase/auth";
import SignInSide from './components/auth/SignInSide';
import SignUpSide from './components/auth/SignUpSide';
import SettingsPage from './components/settings/SettingsPage'; 
import FoodItems from './components/fooditems/FoodItems';
import Discover from './components/discover/Discover'; // Import the component
import ShopFood from './components/leftovers/ShopFood';
import LeftOvers from './components/leftovers/LeftOvers';
import Pantry from './components/leftovers/Pantry';


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
    <Router basename='/foodapp'>
      <Switch>
        <Route exact path='/sign-in'>
          <SignInSide></SignInSide>
        </Route>
        <Route exact path='/sign-up'>
          <SignUpSide></SignUpSide>
        </Route>
        <Route exact path='/home'>
          <Header></Header>
          <Home></Home>
        </Route>
        <Route exact path='/settings'>
          <Header />
          <SettingsPage />
        </Route>
        <Route exact path='/food-items'>
          <Header />
          <FoodItems />
        </Route>
       
        <Route exact path='/shop-food'>
          <Header />
          <ShopFood />
        </Route>
        <Route exact path='/left-overs'>
          <Header />
          <LeftOvers />
        </Route>
        <Route exact path='/pantry'>
          <Header />
          <Pantry />
        </Route>
        <Route exact path='/discover'>
          <Header />
          <Discover />
        </Route>
        <Route exact path='*'>
          <SignInSide></SignInSide>
        </Route>
      </Switch>
    </Router>
    </ThemeProvider>
    </>
  );
}

export default App;
