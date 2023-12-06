import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';

function App() {
  return (
    <>

    <Router basename='/'>
      <Switch>
        <Route exact path='/sign-in'>
          <SignIn></SignIn>
        </Route>
        <Route exact path='/sign-up'>
          <SignUp></SignUp>
        </Route>
        <Route exact path='/home'>
          <Home></Home>
          <AuthDetails></AuthDetails>
        </Route>

        <Route exact path='*'>
          <SignIn></SignIn>
        </Route>
      </Switch>
      
      
    </Router>
    </>
  );
}

export default App;
