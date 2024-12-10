// "use client";

// import { useState, useEffect } from "react";
// import { useUserAuth } from "../utils/auth-context";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { db } from "../utils/firebase";
// import { useRouter } from "next/navigation";

// const MulesPage = () => {
//   const { user } = useUserAuth();
//   const [theme, setTheme] = useState(null);
//   const [backgroundImage, setBackgroundImage] = useState("");
//   const [crystalData, setCrystalData] = useState([]);
//   const [dummyRows, setDummyRows] = useState(1);

//   const [checkedRows, setCheckedRows] = useState([]);
//   const [inputRows, setInputRows] = useState([]);

//   const [monthlyValue, setMonthlyValue] = useState(0);
//   const [weeklyValue, setWeeklyValue] = useState(0);

//   const router = useRouter();

//   const fetchPreferences = async () => {
//     if (user) {
//       try {
//         const preferencesDocRef = doc(db, "users", user.uid, "preferences", "default");
//         const preferencesDoc = await getDoc(preferencesDocRef);
//         const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
//         const savingsDoc = await getDoc(savingsDocRef);

//         if (preferencesDoc.exists()) {
//           const data = preferencesDoc.data();
//           setTheme(data.theme || "yeti");
//         }
//       } catch (error) {
//         console.error("Error fetching preferences:", error);
//       }
//     }
//   };

//   const fetchCrystalPrice = async () => {
//     if (user) {
//       try {
//         const crystalsDocRef = doc(db, "users", user.uid, "preferences", "crystals");
//         const crystalsDoc = await getDoc(crystalsDocRef);

//         if (crystalsDoc.exists()) {
//           const data = crystalsDoc.data();
//           const sortedData = Object.entries(data)
//             .map(([name, value]) => ({ name, value }))
//             .sort((a, b) => a.value - b.value);

//           setCrystalData(sortedData);
//           setCheckedRows(new Array(12).fill(null).map(() => new Array(sortedData.length).fill(false)));
//           setInputRows(new Array(12).fill(null).map(() => new Array(sortedData.length).fill('')));
//         } else {
//           console.log("No crystals document found!");
//         }
//       } catch (error) {
//         console.error("Error fetching crystal data:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchPreferences();
//     fetchCrystalPrice();
//   }, [user]);

//   useEffect(() => {
//     const loadBackgroundImage = async () => {
//       if (theme) {
//         let imageUrl;
//         switch (theme) {
//           case "yeti":
//             imageUrl = "/maxresdefault.jpg";
//             break;
//           case "slime":
//             imageUrl = "/ellinia.webp";
//             break;
//           case "pink-bean":
//             imageUrl = "/d7mmqks-e84ac8cd-f6ba-4468-ad42-b6bf9b813f8d.png";
//             break;
//           case "orange-mushroom":
//             imageUrl = "/d7mlylm-6fd162fc-b3a0-40c9-aea0-a842271c1ea2.png";
//             break;
//           default:
//             imageUrl = "/default-background.jpg";
//             break;
//         }

//         if (imageUrl) {
//           setBackgroundImage(imageUrl);
//         }
//       }
//     };

//     loadBackgroundImage();
//   }, [theme]);

//   const handleCheckboxChange = (rowIndex, colIndex) => {
//     const newCheckedRows = [...checkedRows];
//     newCheckedRows[rowIndex][colIndex] = !newCheckedRows[rowIndex][colIndex];
//     setCheckedRows(newCheckedRows);
//     calculateTotalValues(newCheckedRows, inputRows);
//   };

//   const handleInputChange = (rowIndex, colIndex, value) => {
//     const newInputRows = [...inputRows];
//     newInputRows[rowIndex][colIndex] = value.slice(0, 1);
//     setInputRows(newInputRows);
//     calculateTotalValues(checkedRows, newInputRows);
//   };

//   const addRow = () => {
//     if (dummyRows < 12) {
//       setDummyRows((prevRows) => prevRows + 1);
//       setCheckedRows((prevCheckedRows) => [...prevCheckedRows, new Array(crystalData.length).fill(false)]);
//       setInputRows((prevInputRows) => [...prevInputRows, new Array(crystalData.length).fill('')]);
//     }
//   };

//   const removeRow = () => {
//     if (dummyRows > 1) {
//       setDummyRows((prevRows) => prevRows - 1);
//       setCheckedRows((prevCheckedRows) => prevCheckedRows.slice(0, -1));
//       setInputRows((prevInputRows) => prevInputRows.slice(0, -1));
//     }
//   };

//   const calculateTotalValues = (checkedRows, inputRows) => {
//     let totalMonthly = 0;
//     let totalWeekly = 0;

//     for (let rowIndex = 0; rowIndex < dummyRows; rowIndex++) {
//       for (let colIndex = 0; colIndex < crystalData.length; colIndex++) {
//         if (checkedRows[rowIndex][colIndex] && inputRows[rowIndex][colIndex]) {
//           const crystalValue = crystalData[colIndex].value;
//           const inputValue = parseInt(inputRows[rowIndex][colIndex]);
//           if (inputValue > 0) {
//             const value = crystalValue / inputValue;
//             if (crystalData[colIndex].name === "BM" || crystalData[colIndex].name === "Ex.BM") {
//               totalMonthly += value;
//             } else {
//               totalWeekly += value;
//             }
//           }
//         }
//       }
//     }

//     setMonthlyValue(totalMonthly.toFixed(0));
//     setWeeklyValue(totalWeekly.toFixed(0));
//   };

//   const savePreferences = async () => {
//     if (user) {
//       try {
//         const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
//         const arrayHolderRef = doc(db, "users", user.uid, "preferences", "arrayHolder");

//         const flattenedCheckedRows = checkedRows.flatMap((row, rowIndex) =>
//           row.map((checked, colIndex) => ({
//             row: rowIndex,
//             col: colIndex,
//             checked
//           }))
//         );

//         const flattenedInputRows = inputRows.flatMap((row, rowIndex) =>
//           row.map((input, colIndex) => ({
//             row: rowIndex,
//             col: colIndex,
//             input
//           }))
//         );

//         await updateDoc(savingsDocRef, {
//           monthlybossvalue: parseInt(monthlyValue),
//           weeklybossvalue: parseInt(weeklyValue),
//         });

//         await setDoc(arrayHolderRef, {
//           checkedRows: flattenedCheckedRows,
//           inputRows: flattenedInputRows,
//         });

//         console.log("Preferences saved successfully!");
//       } catch (error) {
//         console.error("Error saving preferences:", error);
//       }
//     }
//   };

//   const loadPreferences = async () => {
//     if (user) {
//       try {
//         const arrayHolderDocRef = doc(db, "users", user.uid, "preferences", "arrayHolder");
//         const arrayHolderDoc = await getDoc(arrayHolderDocRef);

//         if (arrayHolderDoc.exists()) {
//           const { checkedRows, inputRows } = arrayHolderDoc.data();

//           const rebuiltCheckedRows = new Array(dummyRows).fill(null).map(() => new Array(crystalData.length).fill(false));
//           const rebuiltInputRows = new Array(dummyRows).fill(null).map(() => new Array(crystalData.length).fill(''));

//           checkedRows.forEach(({ row, col, checked }) => {
//             if (rebuiltCheckedRows[row] && rebuiltCheckedRows[row][col] !== undefined) {
//               rebuiltCheckedRows[row][col] = checked;
//             }
//           });

//           inputRows.forEach(({ row, col, input }) => {
//             if (rebuiltInputRows[row] && rebuiltInputRows[row][col] !== undefined) {
//               rebuiltInputRows[row][col] = input;
//             }
//           });

//           setCheckedRows(rebuiltCheckedRows);
//           setInputRows(rebuiltInputRows);
//         }

//       } catch (error) {
//         console.error("Error loading preferences:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     loadPreferences();
//   }, [user]);

//   useEffect(() => {
//     loadPreferences();
//   }, [user]);

//   return (
//     <div
//       className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
//     >
//       <div
//         className="text-center w-full relative"
//         style={{
//           backgroundColor: `var(--background)`,
//           borderColor: `var(--foreground)`,
//         }}
//       >
//         <div className="flex justify-center items-center px-4">
//           <h1 className="text-sm font-semibold mb-2" style={{ color: `var(--foreground)` }}>
//             Boss Crystals
//           </h1>
//           <div className="flex space-x-2 ml-8">
//             <button
//               onClick={addRow}
//               className="text-white text-xs font-bold w-6 h-6 flex justify-center items-center rounded"
//               style={{backgroundColor: 'var(--foreground)'}}
//             >
//               +
//             </button>
//             <button
//               onClick={removeRow}
//               className="text-white text-xs font-bold w-6 h-6 flex justify-center items-center rounded"
//               style={{backgroundColor: 'var(--foreground)'}}
//             >
//               -
//             </button>
//           </div>
//         </div>
//         <img
//           src="/home.png"
//           alt="Home"
//           className="absolute top-2 left-2 w-4 h-4 cursor-pointer"
//           onClick={() => router.push("/dashboard")}
//         />
//         <div className="mt-4 w-full overflow-x-auto">
//           <div
//             className="grid"
//             style={{
//               gridTemplateColumns: `repeat(${crystalData.length}, 1fr)`,
//               gap: "0",
//               width: "100%",
//             }}
//           >
//             {crystalData.map((crystal, index) => (
//               <div
//                 key={index}
//                 className="text-[10px] font-semibold text-center border"
//                 style={{
//                   color: `var(--foreground)`,
//                   borderColor: `var(--foreground)`,
//                   height: "30px",
//                   lineHeight: "30px",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                 }}
//               >
//                 {crystal.name.slice(0, 9)}
//               </div>
//             ))}
//             {Array.from({ length: dummyRows }).map((_, rowIndex) =>
//               crystalData.map((_, colIndex) => (
//                 <div
//                   key={`row-${rowIndex}-col-${colIndex}`}
//                   className="text-[10px] text-center border"
//                   style={{
//                     borderColor: `var(--foreground)`,
//                     height: "30px",
//                     lineHeight: "30px",
//                   }}
//                 >
//                   <div className="flex justify-center items-center">
//                     <input
//                       type="checkbox"
//                       checked={checkedRows[rowIndex][colIndex] || false}
//                       onChange={() => handleCheckboxChange(rowIndex, colIndex)}
//                       className="w-3 h-3"
//                     />
//                     <input
//                       type="text"
//                       value={inputRows[rowIndex][colIndex]}
//                       onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
//                       disabled={!checkedRows[rowIndex][colIndex]}
//                       className="w-6 h-6 text-center text-xs border-none"
//                       maxLength={1}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-4">
//         <button
//           onClick={savePreferences}
//           className="text-white text-xs font-bold px-6 py-2 rounded-lg"
//           style={{
//             backgroundColor: 'var(--foreground)',
//           }}
//         >
//           Save Preferences
//         </button>
//       </div>

//       <div className="mt-4 text-lg">
//         <div
//           className="p-4 rounded-xl shadow-lg"
//           style={{
//             backgroundColor: "var(--background)",
//             borderColor: "var(--foreground)",
//           }}
//         >
//           <h2 className="text-center font-semibold text-[12px]" style={{ color: `var(--foreground)` }}>
//             Monthly Total
//           </h2>
//           <p className="text-center text-[18px]" style={{ color: `var(--foreground)` }}>
//             {monthlyValue}
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 text-lg">
//         <div
//           className="p-4 rounded-xl shadow-lg"
//           style={{
//             backgroundColor: "var(--background)",
//             borderColor: "var(--foreground)",
//           }}
//         >
//           <h2 className="text-center font-semibold text-[12px]" style={{ color: `var(--foreground)` }}>
//             Weekly Total
//           </h2>
//           <p className="text-center text-[18px]" style={{ color: `var(--foreground)` }}>
//             {weeklyValue}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MulesPage;
