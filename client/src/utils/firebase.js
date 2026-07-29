
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "rankupai.firebaseapp.com",
  projectId: "rankupai",
  storageBucket: "rankupai.firebasestorage.app",
  messagingSenderId: "534087683073",
  appId: "1:534087683073:web:e3cdb17151135648750400"
};


const app = initializeApp(firebaseConfig);


const auth=getAuth(app);
const provider=new GoogleAuthProvider();

export {auth,provider};
