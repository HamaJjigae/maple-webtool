"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../utils/auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useRouter } from "next/navigation";

const SavingPage = () => {
  const { user } = useUserAuth();
  const router = useRouter();

  const [theme, setTheme] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [wapValue, setWapValue] = useState("");
  const [ursusValue, setUrsusValue] = useState("");
  const [tourValue, setTourValue] = useState("");
  const [dailyBossValue, setDailyBossValue] = useState("");
  const [weeklyBossValue, setWeeklyBossValue] = useState("");
  const [monthlyBossValue, setMonthlyBossValue] = useState("");
  const [randomExpenseValue, setRandomExpenseValue] = useState("");
  const [weeklyDeficit, setWeeklyDeficit] = useState("");
  const [deficit, setDeficit] = useState("");
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [goal, setGoal] = useState("");
  const [weeks, setWeeks] = useState("");
  const [storage, setStorage] = useState("");
  const [wapNumber, setWapNumber] = useState(0);
  const [ursusState, setUrsusState] = useState(false);
  const [tourState, setTourState] = useState(false);
  const [dailyBossState, setDailyBossState] = useState(false);
  const [mpState, setMpState] = useState(false);
  const [wapState, setWapState] = useState(false);

  const fetchPreferences = async () => {
    if (user) {
      try {
        const prefDocRef = doc(db, "users", user.uid, "preferences", "default");
        const preferencesDoc = await getDoc(prefDocRef);
        const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
        const savingsDoc = await getDoc(savingsDocRef);
        const bossDocRef = doc(db, "users", user.uid, "preferences", "boss");
        const bossDoc = await getDoc(bossDocRef);

        if (bossDoc.exists()) {
          const data = bossDoc.data();
          setWeeklyBossValue(data?.wbtotal || 0);
          setMonthlyBossValue(data?.mbtotal || 0);
        }

        if (preferencesDoc.exists()) {
          const data = preferencesDoc.data();
          setTheme(data?.theme || "yeti");
          setUrsusState(data?.ursus || false);
          setTourState(data?.tour || false);
          setDailyBossState(data?.dbstate || false);
          setMpState(data?.mp || false);
          setWapState(data?.wap || false);
        }

        if (savingsDoc.exists()) {
          const savingsData = savingsDoc.data();
          setWapValue(savingsData?.wapvalue ? savingsData.wapvalue.toLocaleString() : "");
          setUrsusValue(savingsData?.ursusvalue ? savingsData.ursusvalue.toLocaleString() : "");
          setTourValue(savingsData?.tourvalue ? savingsData.tourvalue.toLocaleString() : "");
          setDailyBossValue(savingsData?.dailybossvalue ? savingsData.dailybossvalue.toLocaleString() : "");
          setRandomExpenseValue(savingsData?.randomexpensevalue ? savingsData.randomexpensevalue.toLocaleString() : "");
          setWapNumber(savingsData?.wapnumber ? savingsData.wapnumber.toLocaleString() : "");
          setStorage(savingsData?.storage ? savingsData.storage.toLocaleString() : "");
          setGoal(savingsData?.goal ? savingsData.goal.toLocaleString() : "");
          setWeeks(savingsData?.weeks ? savingsData.weeks.toLocaleString() : "");
          setWeeklyDeficit(savingsData?.weeklydeficit ? savingsData.weeklydeficit.toLocaleString() : "");
          setDeficit(savingsData?.deficit ? savingsData.deficit.toLocaleString() : "");
          setWeeklyBossValue(savingsData?.weeklybossvalue ? savingsData.weeklybossvalue.toLocaleString() : "");
          setMonthlyBossValue(savingsData?.monthlybossvalue ? savingsData.monthlybossvalue.toLocaleString() : "");
        }
      } catch (error) {
        console.error("Error fetching values and theme:", error);
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
          default:
            imageUrl = "/maxresdefault.jpg";
        }

        if (imageUrl) {
          setBackgroundImage(imageUrl);
        }
      }
    };

    loadBackgroundImage();
  }, [theme]);


  const handleSave = async () => {
    await handleSubmit()
    if (user) {
      try {
        const savingsDocRef = doc(db, "users", user.uid, "preferences", "savings");
        await setDoc(
          savingsDocRef,
          { 
            wapvalue: parseInt(wapValue.replace(/,/g, "")),
            ursusvalue: parseInt(ursusValue.replace(/,/g, "")),
            tourvalue: parseInt(tourValue.replace(/,/g, "")),
            dailybossvalue: parseInt(dailyBossValue.replace(/,/g, "")),
            randomexpensevalue: parseInt(randomExpenseValue.replace(/,/g, "")),
            wapnumber: parseInt(wapNumber.replace(/,/g, "")),
            storage: parseInt(storage.replace(/,/g, "")),
            goal: parseInt(goal.replace(/,/g, "")),
            weeks: parseInt(weeks.replace(/,/g, "")),
            weeklydeficit: parseInt(weeklyDeficit.replace(/,/g, "")),
            deficit: parseInt(deficit.replace(/,/g, "")),
            weeklybossvalue: parseInt(weeklyBossValue.replace(/,/g, "")),
            monthlybossvalue: parseInt(monthlyBossValue.replace(/,/g, "")),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving WAP value:", error);
      }
    }
  };

  const handleUrsusCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setUrsusState(isChecked);

    if (user) {
      try {
        const prefDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(
          prefDocRef,
          { ursus: isChecked },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating Ursus checkbox:", error);
      }
    }
  };

  const handleTourCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setTourState(isChecked);

    if (user) {
      try {
        const prefDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(
          prefDocRef,
          { tour: isChecked },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating Tour checkbox:", error);
      }
    }
  };
  const handleDailyCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setDailyBossState(isChecked);

    if (user) {
      try {
        const prefDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(
          prefDocRef,
          { dbstate: isChecked },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating Tour checkbox:", error);
      }
    }
  };
  const handleMpCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
    setMpState(isChecked);

    if (user) {
      try {
        const prefDocRef = doc(db, "users", user.uid, "preferences", "default");
        await setDoc(
          prefDocRef,
          { mp: isChecked },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating Ursus checkbox:", error);
      }
    }
  };
  
  const handleSubmit = async () => {
    const cleanedWapValue = wapValue.replace(/,/g, "");
    const cleanedUrsusValue = ursusValue.replace(/,/g, "");
    const cleanedTourValue = tourValue.replace(/,/g, "");
    const cleanedDailyBossValue = dailyBossValue.replace(/,/g, "");
    const cleanedRandomExpenseValue = randomExpenseValue.replace(/,/g, "");
    const cleanedWapNumber = wapNumber.replace(/,/g, "");
    const cleanedStorage = storage.replace(/,/g, "");
    const cleanedGoal = goal.replace(/,/g, "");
    const cleanedWeeks = weeks.replace(/,/g, "");
    const cleanedWeeklyBoss = weeklyBossValue.replace(/,/g, "");
    const cleanedMonthlyBoss = monthlyBossValue.replace(/,/g, "");

    let newWeeklyTotal = 0;

    if (cleanedWapNumber > 0) {
      newWeeklyTotal += parseInt(cleanedWapValue, 10) * cleanedWapNumber;
    }
    if (ursusState) {
      newWeeklyTotal += parseInt(cleanedUrsusValue, 10) * 7;
    }
    if (tourState) {
      newWeeklyTotal += parseInt(cleanedTourValue, 10) * 7;
    }
    if (dailyBossState) {
      newWeeklyTotal += parseInt(cleanedDailyBossValue, 10) * 7;
    }
    if (parseInt(weeklyBossValue) > 0) {
      newWeeklyTotal += parseInt(cleanedWeeklyBoss);
    }
    if (parseInt(monthlyBossValue) > 0) {
      newWeeklyTotal += parseInt(cleanedMonthlyBoss) / 4;
    }
    if (mpState) {
      newWeeklyTotal -= 42000000 * 7;
    }
    if (cleanedRandomExpenseValue > 0) {
      newWeeklyTotal -= parseInt(cleanedRandomExpenseValue, 10);
    }

    console.log('Calculated weekly total:', newWeeklyTotal);
    setWeeklyTotal(newWeeklyTotal.toLocaleString())

    if (cleanedGoal > 0 && cleanedWeeks > 0) {
      const newDeficit = cleanedGoal - cleanedStorage;
      const newWeeklyDeficit = (newDeficit / cleanedWeeks) - newWeeklyTotal;
      setWeeklyDeficit(newWeeklyDeficit.toLocaleString());
      setDeficit(newDeficit.toLocaleString());
    }
    };




  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="text-center p-6 rounded-xl border shadow-lg w-1/2 relative"
        style={{
          backgroundColor: `var(--background)`,
          borderColor: `var(--foreground)`,
          borderWidth: "4px",
        }}
      >
        <h1 className="text-3xl font-semibold mb-4" style={{ color: `var(--foreground)` }}>
          Saving
        </h1>
        <img
          src="/home.png"
          alt="Home"
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        <div className="flex flex-col gap-6 w-full mt-8 px-6">
          <div className="flex flex-col border-4 border-solid border-[var(--foreground)] w-full p-4 mb-4">
            <h2 className="font-semibold text-2xl mb-4 text-left">Income</h2>
            <div className="flex flex-row mb-2 w-full justify-evenly">
              <div className="flex flex-col w-full items-center">
                <label htmlFor="wapValueInput" className="font-semibold text-xl mb-2">
                  WAP Value
                </label>
                <input
                  id="wapValueInput"
                  type="text"
                  value={wapValue}
                  onChange={(e) => setWapValue(e.target.value)}
                  className="w-36 h-8 p-3 text-center border rounded-md"
                  style={{ color: `var(--foreground)` }}
                  placeholder="Enter WAP Value"
                  maxLength={14}
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <label htmlFor="ursusInput" className="font-semibold text-xl mb-2">
                  Daily Ursus&nbsp;
                <input
                  type="checkbox"
                  id="ursusInput"
                  checked={ursusState}
                  onChange={handleUrsusCheckboxChange}
                  className="checkbox"
                />
                </label>
                <input
                  id="ursusValueInput"
                  type="text"
                  value={ursusValue}
                  onChange={(e) => setUrsusValue(e.target.value)}
                  className="w-36 h-8 p-3 text-center border rounded-md"
                  style={{ color: 'var(--foreground)' }}
                  placeholder="Enter Value"
                  maxLength={11}
                  disabled={!ursusState}
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <label htmlFor="tourInput" className="font-semibold text-xl mb-2">
                  Daily Tour&nbsp;
                <input
                  type="checkbox"
                  id="tourBox"
                  checked={tourState}
                  onChange={handleTourCheckboxChange}
                  className="checkbox"
                />
                </label>
                <input
                  id="tourValueInput"
                  type="text"
                  value={tourValue}
                  onChange={(e) => setTourValue(e.target.value)}
                  className="w-36 h-8 p-3 text-center border rounded-md"
                  style={{ color: 'var(--foreground)' }}
                  placeholder="Enter Value"
                  maxLength={11}
                  disabled={!tourState}
                />
              </div>
            </div>
            <div className="flex flex-row mb-2 w-full justify-evenly">
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="dailyBosses" className="font-semibold text-xl mb-2">
                    Daily Bosses&nbsp;
                  <input
                    type="checkbox"
                    id="dailybossInput"
                    checked={dailyBossState}
                    onChange={handleDailyCheckboxChange}
                    className="checkbox"
                  />
                  </label>
                  <input
                    id="dailyBossInput"
                    type="text"
                    value={dailyBossValue}
                    onChange={(e) => setDailyBossValue(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-md"
                    style={{ color: 'var(--foreground)' }}
                    placeholder="Enter Value"
                    maxLength={11}
                    disabled={!dailyBossState}
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="weeklyBosses" className="font-semibold text-xl mb-2">
                    Weekly Bosses&nbsp;
                  </label>
                  <input
                    id="weeklyBossInput"
                    type="text"
                    value={weeklyBossValue}
                    onChange={(e) => setWeeklyBossValue(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-md"
                    style={{ color: 'var(--foreground)' }}
                    placeholder="Enter Value"
                    maxLength={14}
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="monthlyBosses" className="font-semibold text-xl mb-2">
                    Monthly Bosses&nbsp;
                  </label>
                  <input
                    id="monthlyBossInput"
                    type="text"
                    value={monthlyBossValue}
                    onChange={(e) => setMonthlyBossValue(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-md"
                    style={{ color: 'var(--foreground)' }}
                    placeholder="Enter Value"
                    maxLength={14}
                  />
                </div>
            </div>
          </div>
          <div className="flex flex-col border-4 border-solid border-[var(--foreground)] w-full p-4 mb-4">
            <h2 className="font-semibold text-2xl mb-4 text-left">Expenses</h2>
            <div className="flex flex-row mb-2 w-full justify-evenly">
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="mp" className="font-semibold text-xl mb-2">
                    Daily Monster Park;
                  </label>
                  <input
                    type="checkbox"
                    id="dailybossInput"
                    checked={mpState}
                    onChange={handleMpCheckboxChange}
                    className="checkbox"
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="randomexpense" className="font-semibold text-xl mb-2">
                    Random Weekly Expenses
                  </label>
                  <input
                    id="randomExpensesInput"
                    type="text"
                    value={randomExpenseValue}
                    onChange={(e) => setRandomExpenseValue(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-mb"
                    style={{ color: 'var(--foreground)' }}
                    maxLength={14}
                  />
                </div>
            </div>
          </div>
          <div className="flex flex-col border-4 border-solid border-[var(--foreground)] w-full p-4 mb-4">
            <h2 className="font-semibold text-2xl mb-4 text-left">Final Data</h2>
            <div className="flex flex-row mb-2 w-full justify-evenly">
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="wapnumber" className="font-semibold text-xl mb-2">
                    WAPs per Week
                  </label>
                  <input
                    id="wapNumber"
                    type="text"
                    value={wapNumber}
                    onChange={(e) => setWapNumber(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-mb"
                    style={{ color: 'var(--foreground)' }}
                    maxLength={3}
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="storage" className="font-semibold text-xl mb-2">
                    Storage Meso
                  </label>
                  <input
                    id="storage"
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-36 h-8 p-3 text-center border rounded-mb"
                    style={{ color: 'var(--foreground)' }}
                    maxLength={17}
                  />
                </div>
                <div className="flex flex-col w-full items-center">
                  <label htmlFor="goal" className="font-semibold text-xl mb-2">
                    Goal
                  </label>
                  <input
                    id="goal"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-37 h-8 p-3 text-center border rounded-mb"
                    style={{ color: 'var(--foreground)' }}
                    maxLength={18}
                  />
                </div>
            </div>
            <div className="flex flex-row mb-2 w-full justify-items-center">
              <div className="flex flex-col w-full items-center">
                <label htmlFor="numweeks" className="font-semibold text-xl mb-2">
                  Number of Weeks
                </label>
                <input
                  id="weeks"
                  type="text"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="w-36 h-8 p-3 text-center border rounded-mb"
                  style={{ color: 'var(--foreground)' }}
                  maxLength={2}
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <label htmlFor="weeklytotal" className="font-semibold text-xl mb-2">
                  Weekly Total
                </label>
              <input
                id="weektotal"
                type="text"
                value={weeklyTotal}
                className="w-36 h-8 p-3 text-center border rounded-mb"
                style={{ color: 'var(--foreground)' }}
                readOnly
              />
              </div>
            </div>
          <div className="flex flex-row mb-2 w-full justify-items-center">
              <div className="flex flex-col w-full items-center">
                <label htmlFor="weeklydeficit" className="font-semibold text-xl mb-2">
                  Weekly Deficit
                </label>
                <input
                  id="weeklydeficit"
                  type="text"
                  value={weeklyDeficit}
                  className="w-37 h-8 p-3 text-center border rounded-mb"
                  style={{ color: 'var(--foreground)' }}
                  readOnly
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <label htmlFor="deficit" className="font-semibold text-xl mb-2">
                Deficit
                </label>
                <input
                  id="deficit"
                  type="text"
                  value={deficit}
                  className="w-37 h-8 p-3 text-center border rounded-mb"
                  style={{ color: 'var(--foreground)' }}
                  readOnly
                />
              </div>
            </div>
        </div>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 rounded-md"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
              }}
            >
              Submit
            </button>
        </div>
      </div>
    </div>
  );
};

export default SavingPage;
