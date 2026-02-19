import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBzXxVI9OSTYhcRwDir44fdkcBis0hJI2I",
  authDomain: "manulis-ca659.firebaseapp.com",
  projectId: "manulis-ca659",
  storageBucket: "manulis-ca659.firebasestorage.app",
  messagingSenderId: "674962890054",
  appId: "1:674962890054:web:3e3f08ed9e9f408811d947",
  measurementId: "G-7S9RJYF8HG"
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)