import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDC_5EmO8RK4W-EpleM_NJkjqC984284o",
  authDomain: "codesync-773a3.firebaseapp.com",
  projectId: "codesync-773a3",
  storageBucket: "codesync-773a3.firebasestorage.app",
  messagingSenderId: "479788547903",
  appId: "1:479788547903:web:938970905ce4670af01d8a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();