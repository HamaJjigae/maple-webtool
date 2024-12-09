"use client";

import { useState } from "react";
import { useUserAuth } from "../utils/auth-context";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import "../globals.css";

const Questionnaire3Page = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState(null);
  const [wapValue, setWapValue] = useState("");
  const [isWapValueVisible, setIsWapValueVisible] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "wap") {
      setIsWapValueVisible(true);
    } else {
      setIsWapValueVisible(false);
    }
  };

  const handleWapValueChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formattedValue = Number(value).toLocaleString();
      setWapValue(formattedValue);
    } else {
      setWapValue("");
    }
  };

const handleNext = async () => {
    if (!selectedOption) {
      alert("Please select an option to proceed.");
      return;
    }

    const rawValue = parseInt(wapValue.replace(/,/g, ""));

    if (selectedOption === "wap" && wapValue) {
      try {
        const wapValueDocRef = doc(db, "users", user.uid, "preferences", "savings");

        await setDoc(wapValueDocRef, { wapvalue: rawValue }, { merge: true });
      } catch (error) {
        console.error("Error updating WAP value:", error);
      }
    }

    try {
      const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
      await setDoc(preferencesDocRef, { wap: selectedOption === "wap" }, { merge: true });
      await setDoc(preferencesDocRef, { new: false }, { merge: true });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center"
         style={{ backgroundImage: `url('/953496.jpg')` }}>
      <div className="text-center p-6 rounded-xl border shadow-lg max-w-md w-full bg-white bg-opacity-80 relative">
        <h1 className="text-3xl font-semibold mb-4">How do you track money?</h1>

        <div className="flex justify-center items-center space-x-8 mb-4">
          <div
            className={`flex justify-center items-center cursor-pointer ${selectedOption === "mesos" ? "font-bold" : ""}`}
            onClick={() => handleOptionSelect("mesos")}
          >
            <img
              src="/image_2024-12-09_011901280-removebg-preview.png"
              alt="Mesos"
              width={36}
              height={36}
            />
            <span className="ml-2">Mesos</span>
          </div>

          <div
            className={`flex justify-center items-center cursor-pointer ${selectedOption === "wap" ? "font-bold" : ""}`}
            onClick={() => handleOptionSelect("wap")}
          >
            <img
              src="/Use_Wealth_Acquisition_Potion.webp"
              alt="WAP"
              width={36}
              height={36}
            />
            <span className="ml-2">WAPs</span>
          </div>
        </div>

        {isWapValueVisible && (
          <div className="mb-4">
            <input
              type="text"
              value={wapValue}
              onChange={handleWapValueChange}
              placeholder="Enter WAP value"
              className="border border-gray-300 p-2 rounded-lg text-center"
              maxLength={14}
            />
          </div>
        )}

        <div className="flex justify-center gap-2 mb-6 mt-4" style={{ marginTop: "40px" }}>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>

        <div className="absolute bottom-4 right-4 cursor-pointer text-gray-800" onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire3Page;
