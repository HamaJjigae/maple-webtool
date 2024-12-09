"use client";

import { useState } from "react";
import { useUserAuth } from "../utils/auth-context";
import { useRouter } from "next/navigation";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import "../globals.css";

const QuestionnairePage = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [stage, setStage] = useState(1);

  const handleImageClick = (theme) => {
    setSelectedTheme(theme);
  };

  const handleNext = async () => {
    if (selectedTheme) {
      try {
        const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(preferencesDocRef, { theme: selectedTheme }, { merge: true });
        router.push("/questionnaire2");
      } catch (error) {
        console.error("Error updating preferences:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center"
         style={{ backgroundImage: `url('/953496.jpg')` }}>
      <div className="text-center p-6 rounded-xl border shadow-lg max-w-md w-full bg-white bg-opacity-80 relative">
        <h1 className="text-3xl font-semibold mb-4">Choose your theme!</h1>

        {/* Grid layout for images */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleImageClick('slime')}
          >
            <img src="/dciob1u-5cc54f8b-39ad-4f5d-a83b-0f177519af41.png" alt="Slime" className="w-24 h-24 mb-2"/>
            <span className={selectedTheme === 'slime' ? 'font-bold' : ''}>Slime</span>
          </div>

          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleImageClick('yeti')}
          >
            <img src="/yeti.png" alt="Yeti" className="w-24 h-24 mb-2"/>
            <span className={selectedTheme === 'yeti' ? 'font-bold' : ''}>Yeti</span>
          </div>

          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleImageClick('pink-bean')}
          >
            <img src="/image-removebg-preview (3).png" alt="Pink Bean" className="w-24 h-24 mb-2"/>
            <span className={selectedTheme === 'pink-bean' ? 'font-bold' : ''}>Pink Bean</span>
          </div>

          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleImageClick('orange-mushroom')}
          >
            <img src="/image-removebg-preview (2).png" alt="Orange Mushroom" className="w-24 h-24 mb-2"/>
            <span className={selectedTheme === 'orange-mushroom' ? 'font-bold' : ''}>Orange Mushroom</span>
          </div>
        </div>

        {/* Progress bubbles */}
        <div className="flex justify-center gap-2 mb-6 mt-4">
          <div className={`w-2 h-2 rounded-full ${stage >= 1 ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
          <div className={`w-2 h-2 rounded-full ${stage >= 2 ? 'bg-gray-400' : 'bg-gray-400'}`}></div>
          <div className={`w-2 h-2 rounded-full ${stage >= 3 ? 'bg-gray-400' : 'bg-gray-400'}`}></div>
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

export default QuestionnairePage
