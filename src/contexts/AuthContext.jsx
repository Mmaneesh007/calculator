// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Listen for auth state changes (persists across refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // 1. Check direct user doc for manual premium flags
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists() && userDoc.data().isPremium) {
          setIsPremium(true);
        }

        // 2. Listen for real-time Stripe subscriptions via the extension
        const subsRef = collection(db, 'customers', firebaseUser.uid, 'subscriptions');
        const q = query(subsRef, where('status', 'in', ['active', 'trialing']));
        
        const unsubscribeSubs = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setIsPremium(true);
          }
        });

        setLoading(false);
        return () => {
          unsubscribeSubs();
        };
      } else {
        setUser(null);
        setIsPremium(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Save user profile to Firestore on first login
  const saveUserProfile = async (firebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        isPremium: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(result.user);
    return result.user;
  };

  // Email/Password Sign-Up
  const signupWithEmail = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await saveUserProfile(result.user);
    return result.user;
  };

  // Email/Password Login
  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserProfile(result.user);
    return result.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Upgrade to premium (will be called by Razorpay later)
  const upgradeToPremium = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true });
      setIsPremium(true);
    }
  };

  const value = {
    user,
    loading,
    isPremium,
    loginWithGoogle,
    signupWithEmail,
    loginWithEmail,
    logout,
    upgradeToPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
