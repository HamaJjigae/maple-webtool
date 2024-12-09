"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import "../globals.css";

const DashboardPage = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [theme, setTheme] = useState("yeti");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchUserTheme = async () => {
      if (user) {
        try {
          const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
          const preferencesDoc = await getDoc(preferencesDocRef);

          if (preferencesDoc.exists()) {
            const preferences = preferencesDoc.data();
            setTheme(preferences.theme || "yeti"); // Set the user theme or fallback to "yeti"
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      }
    };

    fetchUserTheme();
  }, [user]);

  // Dynamically set background image based on the theme
  useEffect(() => {
    switch (theme) {
      case "yeti":
        setBackgroundImage("/maxresdefault.jpg");
        break;
      case "slime":
        setBackgroundImage("/ellinia.webp");
        break;
      case "pink-bean":
        setBackgroundImage("/d7mmqks-e84ac8cd-f6ba-4468-ad42-b6bf9b813f8d.png");
        break;
      case "orange-mushroom":
        setBackgroundImage("/d7mlylm-6fd162fc-b3a0-40c9-aea0-a842271c1ea2.png");
        break;
      default:
        setBackgroundImage("/maxresdefault.jpg"); // Fallback background image
        break;
    }
  }, [theme]);

  // Dynamically set the data-theme on the HTML element for CSS variables
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div
        className="text-center p-6 rounded-xl border shadow-lg max-w-md w-full relative"
        style={{
          backgroundColor: `var(--background)`, // Apply the background color from theme
          borderColor: `var(--foreground)`,     // Apply the foreground color for the border
          borderWidth: "4px",                   // Adjust the border thickness
        }}
      >
        <h1 className="text-3xl font-semibold mb-4" style={{ color: `var(--foreground)` }}>
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg" style={{ color: `var(--foreground)` }}>
          Your theme is {theme}
        </p>
        {/* Add additional content later */}
      </div>
    </div>
  );
};

export default DashboardPage;
