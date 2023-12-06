// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjyDN06zcKmzCeSOUdLnOdfmOyRSEA6y0",
  authDomain: "cs409project-8ee22.firebaseapp.com",
  projectId: "cs409project-8ee22",
  storageBucket: "cs409project-8ee22.appspot.com",
  messagingSenderId: "534234100144",
  appId: "1:534234100144:web:8953d5e90f70367f102675"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);