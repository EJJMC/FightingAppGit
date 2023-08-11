import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3e9SgW3UlVkBtOiTtvooVfjmdRbYNcHE",
  authDomain: "fir-auth-cb4bd.firebaseapp.com",
  projectId: "fir-auth-cb4bd",
  storageBucket: "fir-auth-cb4bd.appspot.com",
  messagingSenderId: "766706853656",
  appId: "1:766706853656:web:fbaf372fe50c00d896206d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; // Export auth, db, and storage
