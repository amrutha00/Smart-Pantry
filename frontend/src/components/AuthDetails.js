import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {getAuth} from "firebase/auth";
import { useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const AuthDetails = () => {
  const history = useHistory();
  const [authUser, setAuthUser] = useState(null);
  let user = getAuth().currentUser;
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        history.push("/sign-in");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        <>
          <Button
          type="button" 
          color="error" 
          onClick={userSignOut} 
          variant="contained"
          endIcon={<LogoutIcon />}>
            Sign Out
          </Button>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};

export default AuthDetails;