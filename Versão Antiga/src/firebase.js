import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBwOE7MERnQ2JXEUDr64qW1JnubCWLDTWc",
    authDomain: "anamnese-do-sono.firebaseapp.com",
    projectId: "anamnese-do-sono",
    storageBucket: "anamnese-do-sono.appspot.com",
    messagingSenderId: "894053604579",
    appId: "1:894053604579:web:41ea147ecb9f271c7e39d6",
    measurementId: "G-EBE7YN5KRQ"
  };

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };