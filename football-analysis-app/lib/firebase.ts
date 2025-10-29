import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALiAKWq7Z6B9ut6KCHt9L4g8Vt8VHF6iM",
  authDomain: "rw-tips.firebaseapp.com",
  projectId: "rw-tips",
  storageBucket: "rw-tips.appspot.com",
  messagingSenderId: "806941219354",
  appId: "1:806941219354:web:6f904532b6884251444fa3",
  measurementId: "G-64HF8TWQV4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const logout = () => signOut(auth);