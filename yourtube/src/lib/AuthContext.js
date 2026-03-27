"use client"; //Required for Next.js to run React hooks

import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, createContext, useEffect, useContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //Updated to save the secure JWT token as well
  const login = (userdata, token) => {
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handlegooglesignin = async () => {
    try {
      // We ONLY trigger the Google popup here.
      // We removed the duplicate backend call to prevent the race-condition crash.
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Popup Error:", error);
    }
  };

  useEffect(() => {
    // Check local storage so the UI doesn't blink when refreshing the page
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    //This listener acts as the single source of truth for backend communication
    const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
      if (firebaseuser) {
        try {
          const payload = {
            email: firebaseuser.email,
            name: firebaseuser.displayName,
            image: firebaseuser.photoURL || "https://github.com/shadcn.png",
          };
          const response = await axiosInstance.post("/user/login", payload);
          login(response.data.result, response.data.token);
        } catch (error) {
          console.error("Backend Error:", error);
          logout();
        }
      } else {
        // If Firebase says we are logged out, clean everything up
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    });

    return () => unsubcribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);