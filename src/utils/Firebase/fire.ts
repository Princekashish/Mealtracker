// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6T_sYn798AmsTOIx3ow3lgxCLzwtM5Rc",
  authDomain: "mealtracker-df890.firebaseapp.com",
  projectId: "mealtracker-df890",
  storageBucket: "mealtracker-df890.firebasestorage.app",
  messagingSenderId: "1089795478289",
  appId: "1:1089795478289:web:522ab940835fc7e8fd32b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
