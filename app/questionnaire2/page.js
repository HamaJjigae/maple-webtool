"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import "../globals.css";

const Questionnaire2Page = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [checkboxes, setCheckboxes] = useState({
    saving: false,
    legion: false,
    mules: false,
    spares: false,
  });

  useEffect(() => {
    if (checkboxes.saving || checkboxes.legion || checkboxes.mules || checkboxes.spares) {
    }
  }, [checkboxes]);

  const handleCheckboxChange = (option) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const handleNext = async () => {
    if (checkboxes.saving || checkboxes.legion || checkboxes.mules || checkboxes.spares) {
      try {
        const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(preferencesDocRef, checkboxes, { merge: true });
        router.push("/questionnaire3");
      } catch (error) {
        console.error("Error updating preferences:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center"
         style={{ backgroundImage: `url('/953496.jpg')` }}>
      <div className="text-center p-6 rounded-xl border shadow-lg max-w-md w-full bg-white bg-opacity-80 relative">
        <h1 className="text-3xl font-semibold mb-4">What to track?</h1>

        <div className="text-left">
          <div className="flex justify-between mb-2">
            <span>Saving</span>
            <input
              type="checkbox"
              name="saving"
              checked={checkboxes.saving}
              onChange={() => handleCheckboxChange("saving")}
              className="checkbox"
            />
          </div>

          <div className="flex justify-between mb-2">
            <span>Legion</span>
            <input
              type="checkbox"
              name="legion"
              checked={checkboxes.legion}
              onChange={() => handleCheckboxChange("legion")}
              className="checkbox"
            />
          </div>

          <div className={`flex justify-between mb-2 ${checkboxes.legion ? "" : "text-gray-400"}`}>
            <span>Boss Mules</span>
            <input
              type="checkbox"
              name="mules"
              checked={checkboxes.mules}
              onChange={() => handleCheckboxChange("mules")}
              disabled={!checkboxes.legion}
              className="checkbox"
            />
          </div>

          <div className={`flex justify-between mb-4 ${checkboxes.legion ? "" : "text-gray-400"}`}>
            <span>Spares</span>
            <input
              type="checkbox"
              name="spares"
              checked={checkboxes.spares}
              onChange={() => handleCheckboxChange("spares")}
              disabled={!checkboxes.legion}
              className="checkbox"
            />
          </div>
        </div>

        {/* Progress bubbles */}
        <div className="flex justify-center gap-2 mb-6 mt-4" style={{ marginTop: "40px" }}>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>

        {/* Arrow for navigating */}
        <div className="absolute bottom-4 right-4 cursor-pointer text-gray-800" onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire2Page;
