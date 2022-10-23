import { useEffect } from 'react';
import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { serverTimestamp } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      const userRef = doc(db, 'users', user.uid);

      setDoc(userRef,
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL
        }, 
        { merge: true }
      );
    }
  }, [user])

  if(loading) { 
    return <Loading />
  }

  if(!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
