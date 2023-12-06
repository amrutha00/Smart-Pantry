import React, { useState } from "react";
import {getAuth} from "firebase/auth";
import { useHistory } from "react-router-dom";

function Home() {
    const history = useHistory();
    let user = getAuth().currentUser;

  return (
    <>  
        {!user && history.push("/sign-in")}
        <h1>Welcome Home</h1>
    </>
  );
}

export default Home;
