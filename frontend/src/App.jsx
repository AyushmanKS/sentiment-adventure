import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { story, levelBackgrounds, introduction } from "./constants";
import SidePanel from "./components/SidePanel";
import Hero from "./sections/Hero";
import HamburgerButton from "./components/HamburgerButton";
import ConfettiEffect from "./components/ConfettiEffect";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";

const PROGRESS_API_ROUTE = `${API_BASE_URL}/api/progress`;

const getUserId = () => {
  let userId = localStorage.getItem("sentimentAdventureUserId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sentimentAdventureUserId", userId);
  }
  return userId;
};

function App() {
  const [gameState, setGameState] = useState("intro");
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [robotState, setRobotState] = useState("intro");
  const [gameData, setGameData] = useState(story);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId] = useState(getUserId());
  
  const hasFetchedProgress = useRef(false);

  const totalQuestions = useMemo(
    () =>
      (story || [])
        .slice(0, 7)
        .flatMap((level) => level.steps || [])
        .filter((step) => step.type !== "intro").length,
    []
  );
  const completedQuestions = useMemo(
    () =>
      (gameData || [])
        .slice(0, 7)
        .flatMap((level) => level.steps || [])
        .filter((step) => step.type !== "intro" && step.isComplete).length,
    [gameData]
  );

  useEffect(() => {
    if (hasFetchedProgress.current || !userId) return;
    hasFetchedProgress.current = true;

    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${PROGRESS_API_ROUTE}/${userId}`);
        setUnlockedLevel(data.currentLevel);
        setCurrentLevel(data.currentLevel);
      } catch (error) {
        console.error("Could not fetch progress from backend", error);
        setUnlockedLevel(1);
        setCurrentLevel(1);
      }
    };
    fetchProgress();
  }, [userId]);

  const saveProgress = useCallback(async (newLevel) => {
    if (newLevel > unlockedLevel) {
      try {
        await axios.post(`${PROGRESS_API_ROUTE}/${userId}`, {
          newLevel: newLevel,
        });
        setUnlockedLevel(newLevel);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    }
  }, [userId, unlockedLevel]);

  const activeContentData = useMemo(() => {
    if (gameState === "intro") return { steps: introduction };
    return (gameData || []).find((l) => l.level === currentLevel);
  }, [gameState, gameData, currentLevel]);

  const currentStepData = useMemo(() => {
    if (!activeContentData || !activeContentData.steps) {
        return { robot: 'thinking', type: 'intro', text: 'Loading content...' };
    }
    if (currentStep < 0 || currentStep >= activeContentData.steps.length) {
        return { robot: 'thinking', type: 'intro', text: 'Content not found...' };
    }
    return activeContentData.steps[currentStep];
  }, [activeContentData, currentStep]);


  // --- FIX: This useEffect now ONLY sets the robot to its default state when the step/level changes ---
  useEffect(() => {
    // This effect's sole purpose is to set the robot to its default state when a *new* step is loaded.
    // It should NOT react to changes in 'isComplete' for the *current* step.
    setRobotState(currentStepData.robot || "thinking");
    setShowConfetti(false); // Always hide confetti when moving to a new step
  }, [currentStep, currentLevel, gameState, currentStepData.robot]); // Dependencies are strictly about the 'step' changing, not 'isComplete'


  // Confetti logic, separate from default robot state logic
  useEffect(() => {
    const isFinalLevel = currentLevel === 7;
    const isFinalStep = story[6] && currentStep === story[6].steps.length - 1;
    
    if (isFinalLevel && isFinalStep && currentStepData.isComplete) {
      setShowConfetti(true);
      saveProgress(8); // Unlock level 8 on completion of final step
    } else {
      setShowConfetti(false); // Ensure confetti is hidden on other steps
    }
  }, [currentLevel, currentStep, currentStepData.isComplete, saveProgress]);


  const handleSetCurrentLevel = useCallback((level) => {
    setCurrentLevel(level);
    setCurrentStep(0);
    setGameState("playing");
  }, []);

  // --- FIX: handleAnswer now explicitly manages robot state feedback and triggers gameData update ---
  const handleAnswer = useCallback((isCorrect) => {
    let newRobotState;
    if (isCorrect === true) { // For quizzes/cleanup with boolean true
      newRobotState = "happy";
    } else if (isCorrect === false) { // For quizzes/cleanup with boolean false
      newRobotState = "sad";
    } else if (isCorrect === null) { // For sandbox clear where no sentiment is predicted (reset to neutral)
      newRobotState = "neutral";
    } else { // For sandbox where sentiment is a string ('Positive', 'Negative', 'Neutral')
      newRobotState = (isCorrect === 'Positive') ? 'happy' : ((isCorrect === 'Negative') ? 'sad' : 'neutral');
    }
    setRobotState(newRobotState); // UNCONDITIONALLY SET ROBOT EMOTION HERE

    // Mark step complete if answer is positive/correct. This will trigger gameData re-memoization.
    if (isCorrect === true || isCorrect === 'Positive' || isCorrect === 'Negative' || isCorrect === 'Neutral') {
      const newGameData = JSON.parse(JSON.stringify(gameData));
      const level = newGameData.find((l) => l.level === currentLevel);
      if (level && level.steps && level.steps[currentStep]) {
        level.steps[currentStep].isComplete = true;
        setGameData(newGameData); // This update causes a re-render
      }
    }
  }, [gameData, currentLevel, currentStep]);


  const handleNext = useCallback(() => {
    if (gameState === "intro") {
      if (currentStep < introduction.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setGameState("playing");
        setCurrentStep(0);
        setCurrentLevel(unlockedLevel); // Transition from intro to user's unlocked level
      }
      return;
    }

    const currentActiveLevelData = (gameData || []).find((l) => l.level === currentLevel);
    if (!currentActiveLevelData || !currentActiveLevelData.steps) return;

    const isLastStep = currentStep === currentActiveLevelData.steps.length - 1;
    if (isLastStep) {
      if (currentLevel < 8) {
        const nextLevel = currentLevel + 1;
        saveProgress(nextLevel);
        setCurrentLevel(nextLevel);
        setCurrentStep(0);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [gameState, currentStep, currentLevel, introduction, unlockedLevel, gameData, saveProgress]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  const isNextDisabled =
    gameState === "playing" &&
    currentStepData.type !== "intro" &&
    !currentStepData.isComplete;
  const background =
    gameState === "intro"
      ? levelBackgrounds[0]
      : levelBackgrounds[currentLevel - 1];

  if (activeContentData === null && !gameState === 'intro') { // Added check for safety
    return (
      <main className="w-screen h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${levelBackgrounds[0]})` }}>
        <h1 className="text-4xl font-bold text-gray-800">Loading Gloomy's Adventure...</h1>
      </main>
    );
  }

  return (
    <main
      className="w-screen h-screen bg-cover bg-center overflow-hidden transition-all duration-1000"
      style={{ backgroundImage: `url(${background})` }}
    >
      {showConfetti && <ConfettiEffect />}
      {gameState === "playing" && (
        <HamburgerButton onClick={() => setIsSidebarOpen(true)} />
      )}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <SidePanel
              levels={gameData}
              currentLevel={currentLevel}
              userLevel={unlockedLevel}
              setCurrentLevel={handleSetCurrentLevel}
              setIsOpen={setIsSidebarOpen}
            />
          </>
        )}
      </AnimatePresence>
      {activeContentData && activeContentData.steps && (
        <Hero
          levelData={activeContentData}
          currentStep={currentStep}
          currentLevel={currentLevel}
          robotState={robotState}
          onNext={handleNext}
          onPrev={handlePrev}
          onAnswer={handleAnswer}
          isNextDisabled={isNextDisabled}
          isIntro={gameState === "intro"}
          completedQuestions={completedQuestions}
          totalQuestions={totalQuestions}
        />
      )}
    </main>
  );
}

export default App;