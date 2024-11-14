// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJMa2eJ2uMyNPStEOAAXro4TtUVtvhv14",
  authDomain: "dacs-3847d.firebaseapp.com",
  databaseURL:
    "https://dacs-3847d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dacs-3847d",
  storageBucket: "dacs-3847d.firebasestorage.app",
  messagingSenderId: "422869597313",
  appId: "1:422869597313:web:69fdebdc61c77041012180",
  measurementId: "G-XP68ZDXV85",
};
const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const auth = getAuth(app);
export default app;
