"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useRouter } from "next/navigation";

const SavingPage = () => {
  const { user } = useUserAuth();
  const [theme, setTheme] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [wapValue, setWapValue] = useState("");
  
  const router = useRouter();

  const fetchPreferences = async () => {
    if (user) {
      try {
        const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
        const preferencesDoc = await getDoc(preferencesDocRef);

        if (preferencesDoc.exists()) {
          const data = preferencesDoc.data();
          setTheme(data.theme);
        }

        const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
        const savingsDoc = await getDoc(savingsDocRef);
        if (savingsDoc.exists()) {
          const savingsData = savingsDoc.data();
          setWapValue(savingsData.wapvalue ? savingsData.wapvalue.toLocaleString() : "");
        }
        
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

useEffect(() => {
  const loadBackgroundImage = async () => {
    if (theme) {
      let imageUrl;
      switch (theme) {
        case "yeti":
          imageUrl = "/maxresdefault.jpg";
          break;
        case "slime":
          imageUrl = "/ellinia.webp";
          break;
        case "pink-bean":
          imageUrl = "/d7mmqks-e84ac8cd-f6ba-4468-ad42-b6bf9b813f8d.png";
          break;
        case "orange-mushroom":
          imageUrl = "/d7mlylm-6fd162fc-b3a0-40c9-aea0-a842271c1ea2.png";
          break;
      }

      if (imageUrl) {
        setBackgroundImage(imageUrl);
      }
    }
  };

  loadBackgroundImage();
}, [theme]);

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div
        className="text-center p-6 rounded-xl border shadow-lg max-w-lg w-full relative"
        style={{
          backgroundColor: `var(--background)`,
          borderColor: `var(--foreground)`,
          borderWidth: "4px",
        }}
      >
        <h1 className="text-3xl font-semibold mb-4" style={{ color: `var(--foreground)` }}>
          Saving
        </h1>
        {/* Home Button */}
        <img
          src="/home.png"
          alt="Home"
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />
        {/* Display WAP Value */}
        <div className="mt-4 text-lg" style={{ color: `var(--foreground)` }}>
          WAP Value: {wapValue}
        </div>
      </div>
    </div>
  );
};

export default SavingPage;
