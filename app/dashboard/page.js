"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useRouter } from "next/navigation";
import "../globals.css";

const DashboardPage = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [theme, setTheme] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] = useState({
    theme: "yeti",
    saving: false,
    legion: false,
    mules: false,
    spares: false,
    wap: false,
    wapValue: "",
  });

  const [dbPreferences, setDbPreferences] = useState({
    theme: "yeti",
    saving: false,
    legion: false,
    mules: false,
    spares: false,
    wap: false,
  });

  const fetchPreferences = async () => {
    if (user) {
      try {
        const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
        const preferencesDoc = await getDoc(preferencesDocRef);

        if (preferencesDoc.exists()) {
          const data = preferencesDoc.data();
          setPreferences((prev) => ({ ...prev, ...data }));
          setDbPreferences((prev) => ({ ...prev, ...data }));
          setTheme(data.theme || "yeti");
        }

        const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
        const savingsDoc = await getDoc(savingsDocRef);
        if (savingsDoc.exists()) {
          const savingsData = savingsDoc.data();
          setPreferences((prev) => ({
            ...prev,
            wapValue: savingsData.wapvalue ? savingsData.wapvalue.toLocaleString() : "",
          }));
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    }
  };

  const saveWapValue = async () => {
    if (user) {
      try {
        if (preferences.wap && preferences.wapValue) {
          const rawWapValue = parseInt(preferences.wapValue.replace(/,/g, ""));
          const wapDocRef = doc(db, "users", user.uid, "preferences", "savings");
          await setDoc(wapDocRef, { wapvalue: rawWapValue }, { merge: true });
        }
      } catch (error) {
        console.error("Error saving WAP value:", error);
      }
    }
  };

  const savePreferences = async () => {
    if (user) {
      try {
        const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(preferencesDocRef, dbPreferences, { merge: true });

        await saveWapValue();

        setShowSettings(false);
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

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
        setBackgroundImage("/maxresdefault.jpg");
    }
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleCheckboxChange = (field) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [field]: !prev[field] };

      if (field === "wap" && newPreferences.wap) {
        newPreferences.meso = false;
      }

      if (field === "meso" && newPreferences.meso) {
        newPreferences.wap = false;
      }

      const updatedDbPreferences = { ...newPreferences };
      delete updatedDbPreferences.meso;
      delete updatedDbPreferences.wapValue;

      setDbPreferences(updatedDbPreferences);
      return newPreferences;
    });
  };

const handleThemeChange = (newTheme) => {
  setPreferences((prev) => {
    const updatedPreferences = { ...prev, theme: newTheme };
    delete updatedPreferences.wapValue;

    setDbPreferences(updatedPreferences);
    return updatedPreferences;
  });

  setTheme(newTheme);
};

  const handleWapValueChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPreferences((prev) => ({
      ...prev,
      wapValue: value ? Number(value).toLocaleString() : "",
    }));
  };

  const handlePillClick = (page) => {
    router.push(`/${page}`);
  };

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
        Dashboard
      </h1>
      <img
        src="/newgear.webp"
        alt="Settings"
        className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
        onClick={() => setShowSettings(true)}
      />
      {/* Render Pills Grid */}
      <div className="grid grid-cols-2 gap-4 mt-8 justify-items-center items-center">
        {preferences.saving && (
          <div
            className="p-4 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => handlePillClick("saving")}
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              width: "180px",
              height: "60px",
            }}
          >
            Saving
          </div>
        )}
        {preferences.legion && (
          <div
            className="p-4 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => handlePillClick("legion")}
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              width: "180px",
              height: "60px",
            }}
          >
            Legion
          </div>
        )}
        {preferences.mules && (
          <div
            className="p-4 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => handlePillClick("mules")}
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              width: "180px",
              height: "60px",
            }}
          >
            Boss Mule
          </div>
        )}
        {preferences.spares && (
          <div
            className="p-4 flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => handlePillClick("spares")}
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              width: "180px",
              height: "60px",
            }}
          >
            Spares
          </div>
        )}
      </div>
    </div>

    {showSettings && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-6 rounded-xl border shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>
          {/* Themes */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {["yeti", "slime", "pink-bean", "orange-mushroom"].map((themeOption) => (
              <label key={themeOption} className="flex flex-col items-center">
                <input
                  type="radio"
                  name="theme"
                  checked={preferences.theme === themeOption}
                  onChange={() => handleThemeChange(themeOption)}
                  className="mb-1"
                />
                <span className="text-sm">{themeOption}</span>
              </label>
            ))}
          </div>
          {/* Preferences */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {["saving", "legion", "mules", "spares"].map((key) => (
              <label key={key} className="flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => handleCheckboxChange(key)}
                  disabled={(key === "mules" || key === "spares") && !preferences.legion}
                  className="mb-1"
                />
                <span className="text-sm">{key}</span>
              </label>
            ))}
          </div>
          {/* Currency */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            {["meso", "wap"].map((key) => (
              <label key={key} className="flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={key === "wap" ? preferences.wap : !preferences.wap}
                  onChange={() => handleCheckboxChange(key === "wap" ? "wap" : "meso")}
                  className="mb-1"
                />
                <span className="text-sm">{key}</span>
              </label>
            ))}
          </div>
          {preferences.wap && (
            <input
              type="text"
              value={preferences.wapValue}
              onChange={handleWapValueChange}
              className="border border-gray-300 p-2 rounded-lg mt-2 w-full"
              placeholder="Enter WAP value"
              maxLength={14}
            />
          )}
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={savePreferences}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default DashboardPage;
