import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';
// import "firebase/auth";

function App() {
  return (
    <>
      <SignIn></SignIn>
      <SignUp></SignUp>
    </>
  );
}

export default App;
