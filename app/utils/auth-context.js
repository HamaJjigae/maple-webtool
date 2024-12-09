"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");

      const defaultPreferences = {
        theme: "yeti",
        legion: false,
        mules: false,
        saving: false,
        spares: false,
        wap: false,
        new: true,
      };

      try {
        await setDoc(userDocRef, { email: user.email, displayName: user.displayName }, { merge: true });
        await setDoc(preferencesDocRef, defaultPreferences, { merge: true });
      } catch (error) {
        console.error("Error adding user to Firestore:", error);
      }
    }
  };

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
