// import firebase from 'firebase/app';
import { initializeApp, getApp, getApps } from "firebase/app";

import { 
  GoogleAuthProvider, 
  getAuth,
  signInWithPopup
} from "firebase/auth";

import { getFirestore }from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBx27rWuF09SRjZ6ou1NypcDNb70JH4OFg",
    authDomain: "whatsapp-2-cc69d.firebaseapp.com",
    projectId: "whatsapp-2-cc69d",
    storageBucket: "whatsapp-2-cc69d.appspot.com",
    messagingSenderId: "3624049762",
    appId: "1:3624049762:web:dda91508c7d618a425c53b"
  };

const app = !getApps().length 
            ? initializeApp(firebaseConfig) 
            : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

// const db = app.firestore();
// const auth = app.auth();

// const provider = new firebase.auth.GoogleAuthProvider();
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export { db, auth, provider, signInWithGoogle };